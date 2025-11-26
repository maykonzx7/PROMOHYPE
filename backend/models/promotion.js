import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true }, // Preço atual (mantido para compatibilidade)
  link: { type: String, required: true },
  image: { type: String },
  store: { type: String, required: true },
  category: { type: String, default: "Geral" }, 
  description: { type: String }, 
  originalPrice: { type: String }, // Preço original (antes do desconto)
  currentPrice: { type: String }, // Preço atual de venda
  discount: { type: String }, // Percentual ou valor do desconto
  discountAmount: { type: String }, // Valor absoluto do desconto
  hasPromotion: { type: Boolean, default: false }, // Se tem promoção ativa
  installments: { type: Number }, // Número máximo de parcelas
  installmentValue: { type: String }, // Valor da parcela (ex: "R$ 299,90 em até 10x")
  availability: { type: Boolean, default: true }, 
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;