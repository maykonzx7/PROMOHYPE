import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import promotionsRoute from "./routes/promotions.js";
import categoriesRoute from "./routes/categories.js";
import authRoute from "./routes/auth.js";
import statsRoute from "./routes/stats.js";

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

// Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
