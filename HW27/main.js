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
import { readJson } from "./utils.js";

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
      
    }
  }

  // Холодильник API - Получение списка продуктов
  if (req.method === "GET" && req.url === "/api/products") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(fridge));
  }

 // Изменение данных о продуктах (добавление, обновление, удаление)
  if (req.method === "POST" && req.url === "/api/products") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    try {
      const rawBody = await readJson(req);
      const check = validateData("product", rawBody);
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

      // Логика удаления (Tombstone)
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
          res.statusCode = 200;
          return res.end(JSON.stringify({ message: `Партия "${name}" удалена администратором.` }));
        } else {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "Товар для удаления не найден." }));
        }
      }

      // Логика добавления / обновления
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(expDate) < today) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: `Срок годности (${expDate}) истек.` }));
      }

      addOrUpdateProduct(fridge, productIdx, name, count, price, expDate);
      await writeToJsonFile(JSON_FILE, fridge);
      await writeToCsvFile(CSV_FILE, fridge);

      res.statusCode = 200;
      return res.end(JSON.stringify({ 
        message: exists ? "Данные обновлены." : "Добавлена новая партия." 
      }));

    } catch (error) {
      
      res.statusCode = error.status || 500;
      return res.end(JSON.stringify({ error: error.message || "Ошибка обработки данных продукта" }));
    }
  } 

  // Запрос рецепта у нейросети
  if (req.method === "POST" && req.url === "/api/recipe") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    
    try {
      const rawData = await readJson(req);
      const check = validateData("dish", rawData);
      
      if (!check.isValid) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: check.errorMessage }));
      }

      const { username, dishTitle } = check.data; 
      const currentUser = getAuthenticatedUser(username);
      const basePrompt = createBasePromptByRole(currentUser);
      const finalPrompt = createPrompt(basePrompt, dishTitle, fridge);
      const aiResponse = await askAi(finalPrompt);

      res.statusCode = 200;
      return res.end(JSON.stringify({ recipe: aiResponse }));

    } catch (error) {
      res.statusCode = error.status || 500; 
      return res.end(JSON.stringify({ error: error.message || "Внутренняя ошибка сервера" }));
    }
  } 

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: "Маршрут не найден" }));
});

async function startApp() {
  await loadInitialData(); 
  server.listen(PORT, () => { 
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });
}

startApp();