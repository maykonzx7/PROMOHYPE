import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import promotionsRoute from "./routes/promotions.js";

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

// Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
