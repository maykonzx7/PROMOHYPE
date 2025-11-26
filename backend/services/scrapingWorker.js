import mongoose from "mongoose";
import dotenv from "dotenv";
import scheduler from "./scrapingScheduler.js";

dotenv.config();

/**
 * Worker para executar o scraping scheduler
 * Conecta ao MongoDB e inicia o scheduler
 */
(async () => {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado!");

    // Iniciar scheduler
    scheduler.start();

    // Tratamento de sinais para encerramento gracioso
    process.on('SIGINT', () => {
      console.log("\n🛑 Recebido SIGINT, encerrando...");
      scheduler.stop();
      mongoose.connection.close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log("\n🛑 Recebido SIGTERM, encerrando...");
      scheduler.stop();
      mongoose.connection.close();
      process.exit(0);
    });

    // Manter processo vivo
    console.log("\n⏳ Worker rodando... Pressione Ctrl+C para parar.\n");

  } catch (err) {
    console.error("❌ Erro ao iniciar worker:", err);
    process.exit(1);
  }
})();

