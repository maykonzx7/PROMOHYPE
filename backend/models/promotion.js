import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String },
  store: { type: String, required: true },
  category: { type: String, default: "Geral" }, 
  description: { type: String }, 
  originalPrice: { type: String }, 
  currentPrice: { type: String }, 
  discount: { type: String }, 
  availability: { type: Boolean, default: true }, 
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;