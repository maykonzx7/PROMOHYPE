import express from "express";
import Promotion from "../models/promotion.js";

const router = express.Router();

// GET todas as categorias com contagem
router.get("/", async (req, res) => {
  try {
    // Contar promoções por categoria
    const categoryCounts = await Promotion.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$_id",
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Formatar a resposta
    const categories = categoryCounts.map(category => ({
      id: category.id,
      name: category.name,
      count: category.count,
      image: "" 
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

// GET promoções por categoria
router.get("/promotions/:category", async (req, res) => {
  try {
    const promotions = await Promotion.find({ category: req.params.category }).sort({ scrapedAt: -1 });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoções por categoria." });
  }
});

export default router;