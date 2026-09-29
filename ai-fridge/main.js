// main.js

import http from "node:http";
import { PORT } from "./config.js";
import { requestHandler } from "./router.js";
import { loadInitialData } from "./data/db.js";

const server = http.createServer(requestHandler);

async function startApp() {
  try {
    
    await loadInitialData(); 
    
    server.listen(PORT, () => { 
      console.log(`[OK] Сервер успешно запущен!`);
      console.log(`[OK] Откройте в браузере: http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.error("[FATAL] КРИТИЧЕСКАЯ ОШИБКА при запуске сервера:", err);
    process.exit(1);
  }
}

startApp();