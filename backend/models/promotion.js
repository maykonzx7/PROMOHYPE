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
  // Campos adicionais coletados via crawling
  specifications: { type: Array }, // Especificações do produto [{key, value}]
  rating: { type: String }, // Avaliação média do produto
  reviewsCount: { type: String }, // Número de avaliações
  condition: { type: String }, // Condição do produto (novo, usado, etc.)
  seller: { type: String }, // Nome do vendedor
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;