import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import searchHype from "../scraping/searchhype.js";
import Promotion from "../models/promotion.js";
import scheduler from "../services/scrapingScheduler.js";

const router = express.Router();

/**
 * POST /api/scraping/run
 * Executa o scraping de todas as lojas e salva no banco
 * Requer autenticação de admin
 */
router.post("/run", authenticateToken, async (req, res) => {
  try {
    console.log("🚀 Scraping iniciado via API...");
    
    const { searchTerms } = req.body;
    const terms = searchTerms || ['smartphone', 'notebook', 'tv', 'headphone', 'tablet'];

    // Executar scraping
    const promotions = await searchHype(terms);

    if (promotions.length === 0) {
      return res.status(200).json({
        message: "Nenhuma promoção encontrada.",
        saved: 0,
        updated: 0,
        skipped: 0
      });
    }

    // Salvar/atualizar promoções
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

    res.json({
      message: "Scraping concluído com sucesso!",
      total: promotions.length,
      saved,
      updated,
      skipped
    });

  } catch (err) {
    console.error("Erro no scraping:", err);
    res.status(500).json({ error: "Erro ao executar scraping.", details: err.message });
  }
});

/**
 * GET /api/scraping/stats
 * Retorna estatísticas do scraping
 */
router.get("/stats", async (req, res) => {
  try {
    const totalPromotions = await Promotion.countDocuments();
    
    const byStore = await Promotion.aggregate([
      {
        $group: {
          _id: "$store",
          count: { $sum: 1 },
          lastScraped: { $max: "$scrapedAt" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentPromotions = await Promotion.countDocuments({
      scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Estatísticas do scheduler
    const schedulerStats = scheduler.getStats();

    res.json({
      total: totalPromotions,
      recent24h: recentPromotions,
      byStore,
      scheduler: schedulerStats
    });

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
});

/**
 * GET /api/scraping/status
 * Retorna status do scheduler
 */
router.get("/status", async (req, res) => {
  try {
    const stats = scheduler.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar status." });
  }
});

/**
 * POST /api/scraping/start
 * Inicia o scheduler de scraping em tempo real
 */
router.post("/start", authenticateToken, async (req, res) => {
  try {
    scheduler.start();
    res.json({ 
      message: "Scheduler iniciado com sucesso!",
      stats: scheduler.getStats()
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao iniciar scheduler." });
  }
});

/**
 * POST /api/scraping/stop
 * Para o scheduler
 */
router.post("/stop", authenticateToken, async (req, res) => {
  try {
    scheduler.stop();
    res.json({ message: "Scheduler parado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao parar scheduler." });
  }
});

/**
 * PUT /api/scraping/config
 * Atualiza configuração do scheduler
 */
router.put("/config", authenticateToken, async (req, res) => {
  try {
    const { interval, searchTerms, enabled } = req.body;
    
    scheduler.updateConfig({
      interval,
      searchTerms,
      enabled
    });

    res.json({ 
      message: "Configuração atualizada com sucesso!",
      config: scheduler.getStats().config
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar configuração." });
  }
});

export default router;

