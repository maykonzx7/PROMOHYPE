import dotenv from "dotenv";
import app from "./app.js";

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
