import mongoose from "mongoose";
import dotenv from "dotenv";
import searchHype from "../scraping/searchhype.js";
import Promotion from "../models/promotion.js";

dotenv.config();

/**
 * Serviço de Scraping em Tempo Real
 * Executa scraping periodicamente com configuração de intervalos
 */
class ScrapingScheduler {
  constructor() {
    this.isRunning = false;
    this.currentJob = null;
    this.interval = null;
    this.stats = {
      lastRun: null,
      totalRuns: 0,
      totalPromotions: 0,
      errors: []
    };
    
    // Configuração padrão - pode ser alterada via variáveis de ambiente
    this.config = {
      interval: parseInt(process.env.SCRAPING_INTERVAL) || 30 * 60 * 1000, // 30 minutos padrão
      searchTerms: (process.env.SCRAPING_SEARCH_TERMS || 'smartphone,notebook,tv,headphone,tablet,gaming,monitor').split(','),
      maxResultsPerStore: parseInt(process.env.SCRAPING_MAX_RESULTS) || 15, // Máximo de resultados por loja
      enabled: process.env.SCRAPING_ENABLED !== 'false'
    };
  }

  /**
   * Salva promoções no banco evitando duplicatas
   */
  async savePromotions(promotions) {
    let saved = 0;
    let updated = 0;
    let skipped = 0;

    for (const promo of promotions) {
      try {
        const normalizedLink = promo.link?.split('?')[0];
        
        const existing = await Promotion.findOne({
          $or: [
            { link: normalizedLink },
            { link: promo.link },
            { 
              title: promo.title,
              store: promo.store 
            }
          ]
        });

        if (existing) {
          if (existing.price !== promo.price) {
            await Promotion.findByIdAndUpdate(existing._id, {
              ...promo,
              link: normalizedLink || promo.link,
              scrapedAt: new Date()
            });
            updated++;
          } else {
            // Atualizar apenas data mesmo se não mudou o preço
            await Promotion.findByIdAndUpdate(existing._id, {
              scrapedAt: new Date()
            });
            skipped++;
          }
        } else {
          await Promotion.create({
            ...promo,
            link: normalizedLink || promo.link,
          });
          saved++;
        }
      } catch (err) {
        console.error(`Erro ao salvar promoção:`, err.message);
        continue;
      }
    }

    return { saved, updated, skipped };
  }

  /**
   * Executa uma rodada de scraping
   */
  async runScraping() {
    if (this.isRunning) {
      console.log("⏸️  Scraping já está em execução, ignorando...");
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log(`\n🔄 [${new Date().toLocaleString('pt-BR')}] Iniciando scraping...`);
      console.log(`📋 Termos: ${this.config.searchTerms.join(", ")}`);
      
      const promotions = await searchHype(this.config.searchTerms);

      if (promotions.length === 0) {
        console.log("⚠️  Nenhuma promoção encontrada.");
        this.stats.lastRun = new Date();
        this.stats.errors.push({
          timestamp: new Date(),
          error: "Nenhuma promoção encontrada"
        });
        return;
      }

      console.log(`💾 Salvando ${promotions.length} promoções...`);
      const { saved, updated, skipped } = await this.savePromotions(promotions);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log(`\n✅ Scraping concluído em ${duration}s`);
      console.log(`📊 Estatísticas:`);
      console.log(`   - Novas: ${saved}`);
      console.log(`   - Atualizadas: ${updated}`);
      console.log(`   - Sem mudanças: ${skipped}`);
      console.log(`   - Total processado: ${saved + updated + skipped}`);

      // Atualizar estatísticas
      this.stats.lastRun = new Date();
      this.stats.totalRuns++;
      this.stats.totalPromotions += promotions.length;

    } catch (error) {
      console.error(`❌ Erro no scraping:`, error);
      this.stats.errors.push({
        timestamp: new Date(),
        error: error.message
      });
      
      // Manter apenas últimos 10 erros
      if (this.stats.errors.length > 10) {
        this.stats.errors = this.stats.errors.slice(-10);
      }
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Inicia o scheduler de scraping
   */
  start() {
    if (!this.config.enabled) {
      console.log("⚠️  Scraping desabilitado. Configure SCRAPING_ENABLED=true para habilitar.");
      return;
    }

    if (this.interval) {
      console.log("⚠️  Scheduler já está rodando.");
      return;
    }

    console.log("🚀 Iniciando Scraping Scheduler...");
    console.log(`⏰ Intervalo: ${this.config.interval / 1000 / 60} minutos`);
    console.log(`📋 Termos de busca: ${this.config.searchTerms.join(", ")}`);
    console.log(`🔢 Max resultados por loja: ${this.config.maxResultsPerStore}`);

    // Executar imediatamente na primeira vez
    this.runScraping();

    // Agendar execuções periódicas
    this.interval = setInterval(() => {
      this.runScraping();
    }, this.config.interval);

    console.log("✅ Scheduler iniciado com sucesso!");
  }

  /**
   * Para o scheduler
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("🛑 Scheduler parado.");
    }
  }

  /**
   * Obtém estatísticas do scheduler
   */
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      config: {
        interval: this.config.interval / 1000 / 60, // em minutos
        searchTerms: this.config.searchTerms,
        enabled: this.config.enabled
      },
      nextRun: this.interval ? new Date(Date.now() + this.config.interval) : null
    };
  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig) {
    const wasRunning = !!this.interval;
    
    if (wasRunning) {
      this.stop();
    }

    if (newConfig.interval) {
      this.config.interval = newConfig.interval * 60 * 1000; // converter minutos para ms
    }
    
    if (newConfig.searchTerms) {
      this.config.searchTerms = Array.isArray(newConfig.searchTerms) 
        ? newConfig.searchTerms 
        : newConfig.searchTerms.split(',');
    }

    if (newConfig.enabled !== undefined) {
      this.config.enabled = newConfig.enabled;
    }

    if (wasRunning && this.config.enabled) {
      this.start();
    }

    console.log("✅ Configuração atualizada:", this.config);
  }
}

// Criar instância singleton
const scheduler = new ScrapingScheduler();

export default scheduler;

