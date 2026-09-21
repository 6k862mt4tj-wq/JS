import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { JSON_FILE, CSV_FILE, ROLES, PORT, INDEX_PATH } from "./config.js";
import { getAuthenticatedUser } from "./authService.js";
import { validateData } from "./validateData.js";
import { readFromJsonFile, writeToJsonFile, writeToCsvFile, readHtmlFile } from "./fileService.js";
import { findProductIndex, addOrUpdateProduct, removeProduct } from "./arrayService.js";
import { createBasePromptByRole, createPrompt } from "./promptService.js";
import { askAi } from "./aiService.js";

let fridge = [];
async function loadInitialData() {
  const rawData = await readFromJsonFile(JSON_FILE);
  rawData.forEach((item) => {
    const check = validateData("product", item);
    if (check.isValid && check.data.count > 0) {
      fridge.push(check.data);
    }
  });

  if (fridge.length > 0) {
    console.log(`[i] Успешно загружено ${fridge.length} записей из базы.`);
  } else {
    console.log("[i] Холодильник пуст. Начинаем с чистого листа.");
  }
}

const server = http.createServer(async (req, res) => {
  
  // Интерфейс HTML
  if (req.method === "GET" && req.url === "/") {
    const html = await readHtmlFile(INDEX_PATH);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  // Статические файлы
  if (req.method === "GET" && req.url === "/FRIDGE.jpg") {
    try {
      const img = await readFile(path.resolve("FRIDGE.jpg"));
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      return res.end(img);
    } catch (e) {
      // Игнорируем и проваливаемся в 404
    }
  }

  // Холодильник API - Получение списка продуктов
  if (req.method === "GET" && req.url === "/api/products") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(fridge));
  }

  // Изменение данных о продуктах (добавление, обновление, удаление)
  if (req.method === "POST" && req.url === "/api/products") {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk.toString();
      if (rawBody.length > 1024 * 1024) req.destroy(new Error("Payload Too Large"));
    });
    req.on("end", async () => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");

      try {
        const rawItem = JSON.parse(rawBody);
        const check = validateData("product", rawItem);
        if (!check.isValid) {
          res.statusCode = 400; 
          return res.end(JSON.stringify({ error: check.errorMessage }));
        }

        const { username, name, count, price, expDate } = check.data;
        const currentUser = getAuthenticatedUser(username);

        if (currentUser.role === ROLES.GUEST) {
          res.statusCode = 403; 
          return res.end(JSON.stringify({ 
            error: `Пользователь "${currentUser.name}" (GUEST) может только просматривать данные.` 
          }));
        }

        const productIdx = findProductIndex(fridge, name, expDate);
        const exists = productIdx !== -1;

        if (count === 0) {
          if (currentUser.role !== ROLES.ADMIN) {
            res.statusCode = 403;
            return res.end(JSON.stringify({ 
              error: `Пользователь "${currentUser.name}" (${currentUser.role}) не имеет прав на удаление.` 
            }));
          }

          if (exists) {
            removeProduct(fridge, productIdx);
            await writeToJsonFile(JSON_FILE, fridge);
            await writeToCsvFile(CSV_FILE, fridge);
            return res.end(JSON.stringify({ message: `Партия "${name}" удалена администратором.` }));
          } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Товар для удаления не найден." }));
          }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(expDate) < today) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: `Срок годности (${expDate}) истек.` }));
        }

        addOrUpdateProduct(fridge, productIdx, name, count, price, expDate);
        
        await writeToJsonFile(JSON_FILE, fridge);
        await writeToCsvFile(CSV_FILE, fridge);

        return res.end(JSON.stringify({ 
          message: exists ? "Данные обновлены." : "Добавлена новая партия." 
        }));

      } catch (error) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Некорректный формат JSON запроса." }));
      }
    });
    return;
  }

  // Запрос к AI Шеф-повару
  if (req.method === "POST" && req.url === "/api/recipe") {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk.toString();
      if (rawBody.length > 1024 * 1024) req.destroy(new Error("Payload Too Large"));
    });

    req.on("end", async () => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      try {
        const { username, dishTitle } = JSON.parse(rawBody);

        if (!dishTitle) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "Не указано название блюда." }));
        }

        const currentUser = getAuthenticatedUser(username);
        const basePrompt = createBasePromptByRole(currentUser);
        const finalPrompt = createPrompt(basePrompt, dishTitle, fridge);
        const aiResponse = await askAi(finalPrompt);

        return res.end(JSON.stringify({ recipe: aiResponse }));
      } catch (error) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Маршрут не найден" }));
});

async function startApp() {
  await loadInitialData(); 
  server.listen(PORT, () => { 
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });
}

startApp();