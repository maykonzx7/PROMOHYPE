import express from "express";
import Promotion from "../models/promotion.js";

const router = express.Router();

// GET estatísticas gerais
router.get("/", async (req, res) => {
  try {
    const totalPromotions = await Promotion.countDocuments();
    const totalStores = await Promotion.distinct("store");
    const promotionsByStore = await Promotion.aggregate([
      {
        $group: {
          _id: "$store",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          store: "$_id",
          count: 1
        }
      }
    ]);
    
    const promotionsByDay = await Promotion.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$scrapedAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    res.json({
      totalPromotions,
      totalStores: totalStores.length,
      promotionsByStore,
      promotionsByDay: promotionsByDay.slice(0, 7) // Últimos 7 dias
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
});

// GET promoções mais recentes
router.get("/recent", async (req, res) => {
  try {
    const recentPromotions = await Promotion.find()
      .sort({ scrapedAt: -1 })
      .limit(10);
    res.json(recentPromotions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoções recentes." });
  }
});

export default router;