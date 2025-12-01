import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import promotionsRoute from "./routes/promotions.js";
import categoriesRoute from "./routes/categories.js";
import authRoute from "./routes/auth.js";
import statsRoute from "./routes/stats.js";
import scrapingRoute from "./routes/scraping.js";

// Carrega variáveis de ambiente
dotenv.config();

// Cria instância do Express
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Conexão com MongoDB (reutilizada entre invocações em ambiente serverless)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Rotas principais da API
app.use("/api/promotions", promotionsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/auth", authRoute);
app.use("/api/stats", statsRoute);
app.use("/api/scraping", scrapingRoute);

// Exporta a app para ser usada tanto localmente quanto na Vercel
export default app;


