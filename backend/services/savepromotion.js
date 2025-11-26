import mongoose from "mongoose";
import dotenv from "dotenv";
import searchHype from "../scraping/searchhype.js";
import Promotion from "../models/promotion.js";

dotenv.config();

/**
 * Serviço melhorado para salvar promoções
 * Evita duplicatas e atualiza promoções existentes
 */
(async () => {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado!");

    console.log("\n🔄 Iniciando scraping...");
    const promotions = await searchHype();

    if (promotions.length === 0) {
      console.log("⚠️  Nenhuma promoção encontrada.");
      process.exit(0);
    }

    console.log(`\n💾 Salvando ${promotions.length} promoções...`);
    
    let saved = 0;
    let updated = 0;
    let skipped = 0;

    for (const promo of promotions) {
      try {
        // Normalizar link para evitar duplicatas
        const normalizedLink = promo.link?.split('?')[0]; // Remove query params
        
        // Verificar se já existe uma promoção com o mesmo link ou título+loja
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
          // Atualizar promoção existente se o preço mudou
          if (existing.price !== promo.price) {
            await Promotion.findByIdAndUpdate(existing._id, {
              ...promo,
              link: normalizedLink || promo.link,
              scrapedAt: new Date()
            });
            updated++;
            console.log(`↻ Atualizado: ${promo.title.substring(0, 50)}...`);
          } else {
            // Atualizar apenas a data de scraping
            await Promotion.findByIdAndUpdate(existing._id, {
              scrapedAt: new Date()
            });
            skipped++;
          }
        } else {
          // Criar nova promoção
          await Promotion.create({
            ...promo,
            link: normalizedLink || promo.link,
          });
          saved++;
          console.log(`✓ Salvo: ${promo.title.substring(0, 50)}...`);
        }
      } catch (err) {
        console.error(`✗ Erro ao salvar "${promo.title}":`, err.message);
        continue;
      }
    }

    console.log("\n✅ Processamento concluído!");
    console.log(`📈 Estatísticas:`);
    console.log(`   - Novas promoções: ${saved}`);
    console.log(`   - Atualizadas: ${updated}`);
    console.log(`   - Ignoradas (sem mudanças): ${skipped}`);
    console.log(`   - Total processado: ${saved + updated + skipped}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
})();
