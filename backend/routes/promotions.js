import express from "express";
import Promotion from "../models/promotion.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET todas as promoções
router.get("/", async (req, res) => {
  try {
    const { category, search, store, minPrice, maxPrice } = req.query;
    let query = {};

    // Filtro por categoria
    if (category) {
      query.category = category;
    }

    // Filtro por busca textual
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro por loja
    if (store) {
      query.store = store;
    }

    const promotions = await Promotion.find(query).sort({ scrapedAt: -1 }); 

    // Filtragem por faixa de preço após a busca (porque preço é armazenado como string)
    let filteredPromotions = promotions;
    if (minPrice || maxPrice) {
      filteredPromotions = promotions.filter(promo => {
        // Extrair valor numérico do preço (remover caracteres não numéricos exceto vírgula e ponto)
        const priceValue = parseFloat(promo.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
        let minPriceValue = minPrice ? parseFloat(minPrice.replace(/[^\d,.-]/g, '').replace(',', '.')) : null;
        let maxPriceValue = maxPrice ? parseFloat(maxPrice.replace(/[^\d,.-]/g, '').replace(',', '.')) : null;

        if (minPriceValue !== null && priceValue < minPriceValue) {
          return false;
        }
        if (maxPriceValue !== null && priceValue > maxPriceValue) {
          return false;
        }
        return true;
      });
    }

    res.json(filteredPromotions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoções." });
  }
});

// GET promoção por ID
router.get("/:id", async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: "Promoção não encontrada." });
    }
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoção." });
  }
});

// POST criar nova promoção (protegido com autenticação)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT atualizar promoção (protegido com autenticação)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!promotion) {
      return res.status(404).json({ error: "Promoção não encontrada." });
    }
    res.json(promotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE remover promoção (protegido com autenticação)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ error: "Promoção não encontrada." });
    }
    res.json({ message: "Promoção deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar promoção." });
  }
});

// GET promoções por loja
router.get("/store/:store", async (req, res) => {
  try {
    const promotions = await Promotion.find({ store: req.params.store }).sort({ scrapedAt: -1 });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar promoções por loja." });
  }
});

export default router;
