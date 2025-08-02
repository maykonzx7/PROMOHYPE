import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: String,
  price: String,
  link: String,
  store: String,
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Promotion", promotionSchema);
