import express from "express";
import Promotion from "../models/promotion.js";

const router = express.Router();

// GET todas as promoções
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ scrapedAt: -1 }); // mais recentes primeiro
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoções." });
  }
});

export default router;
