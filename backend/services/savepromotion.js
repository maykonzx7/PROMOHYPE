import mongoose from "mongoose";
import dotenv from "dotenv";
import searchHype from "../scraping/searchhype.js";
import Promotion from "../models/promotion.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado!");

    const promotions = await searchHype();

    for (const promo of promotions) {
      await Promotion.create(promo);
      console.log("Salvo:", promo.title);
    }

    console.log("Finalizado.");
    process.exit(0);
  } catch (err) {
    console.error("Erro:", err);
    process.exit(1);
  }
})();
