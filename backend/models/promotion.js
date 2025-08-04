import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: String,
  price: String,
  link: String,
  image: String,
  store: String,
  scrapedAt: {
    type: Date,
    default: Date.now,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;