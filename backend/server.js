import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import promotionsRoute from "./routes/promotions.js";
import categoriesRoute from "./routes/categories.js";
import authRoute from "./routes/auth.js";
import statsRoute from "./routes/stats.js";
import scrapingRoute from "./routes/scraping.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Conecta no MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// Rotas
app.use("/api/promotions", promotionsRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/auth", authRoute);
app.use("/api/stats", statsRoute);
app.use("/api/scraping", scrapingRoute);

// Inicializa servidor
const PORT = process.env.PORT || 5000;

// Iniciar scheduler se estiver habilitado
if (process.env.START_SCHEDULER === 'true') {
  import('./services/scrapingScheduler.js').then(({ default: scheduler }) => {
    scheduler.start();
    console.log("✅ Scheduler iniciado automaticamente");
  }).catch(err => {
    console.error("Erro ao iniciar scheduler:", err);
  });
}

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
