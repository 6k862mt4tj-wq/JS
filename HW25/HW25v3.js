import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

// === Configuration ===
const JSON_FILE = path.resolve("fridge.json");
const CSV_FILE = path.resolve("fridge.csv");
const STOP_WORDS = ["exit", "выход", "стоп", "stop"];

// === Validators ===

function parseValidName(rawName) {
  if (typeof rawName !== "string") return null;
  const cleanName = rawName.trim().replace(/\s+/g, " ");
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/;
  return (cleanName.length > 0 && nameRegex.test(cleanName)) ? cleanName : null;
}

function isValidNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0;
}

function isValidDate(dateString) {
  if (typeof dateString !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().startsWith(dateString);
}

// === File Operations ===

async function writeToJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function writeToCsvFile(filePath, data) {
  const csvHeader = "Наименование,Количество,Цена,Срок_годности\n";
  const csvData = data
    .map((p) => `"${p.name}",${p.count},${p.price},"${p.expDate}"`)
    .join("\n");
  await writeFile(filePath, csvHeader + csvData, "utf-8");
}

async function readFromJsonFile(filePath) {
  const fileData = await readFile(filePath, "utf-8");
  return JSON.parse(fileData);
}

function validateFridgeData(rawData) {
  if (!Array.isArray(rawData)) {
    console.warn("[!] Ошибка формата сохранения. Начинаем с чистого листа.");
    return [];
  }

  const validData = [];
  rawData.forEach((item) => {
    if (typeof item !== "object" || item === null) return;

    const validName = parseValidName(item.name);
    if (!validName) return;
    if (!isValidNumber(item.count) || item.count === 0) return;
    if (!isValidNumber(item.price)) return;
    if (!isValidDate(item.expDate)) return;

    validData.push({
      name: validName,
      count: item.count,
      price: item.price,
      expDate: item.expDate
    });
  });

  return validData;
}

// === Console Helpers ===

async function askName(rl, questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    const validName = parseValidName(answer);

    if (!validName) {
      console.log("Ошибка: Имя содержит недопустимые символы или пустое.");
      console.log("Разрешены только буквы, цифры, пробелы и дефис.");
      continue;
    }
    return validName; 
  }
}

async function askNumber(rl, questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    const trimmed = answer.trim();

    if (trimmed === "") {
      console.log("Ошибка: Пустой ввод. Пожалуйста, укажите число.");
      continue;
    }

    const number = Number(trimmed.replace(",", "."));
    
    if (Number.isNaN(number)) {
      console.log("Ошибка: Введено не число. Попробуйте снова.");
      continue;
    }
    if (number < 0) {
      console.log("Ошибка: Значение не может быть отрицательным.");
      continue;
    }
    return number;
  }
}

function displayFridgeContents(fridge) {
  console.log("\n=== Список продуктов в холодильнике ===");
  if (fridge.length === 0) {
    console.log("Холодильник пуст.");
  } else {
    console.table(fridge);
  }
}

// === Array Operations ===

function addOrUpdateProduct(fridge, idx, name, count, price, expDate) {
  if (idx !== -1) {
    fridge[idx].count = count;
    fridge[idx].price = price;
  } else {
    fridge.push({ name, count, price, expDate });
  }
}

function removeProduct(fridge, idx) {
  if (idx !== -1) fridge.splice(idx, 1);
}

// === Main Application ===

async function runFridgeApp() {
  const rl = readline.createInterface({ input, output });
  let fridge = [];

  console.log("\n=== Учет продуктов ===");

 
  try {
    const rawData = await readFromJsonFile(JSON_FILE);
    fridge = validateFridgeData(rawData);
    console.log(`[i] Успешно загружено и проверено ${fridge.length} партий продуктов.`);
  } catch (error) {
    console.log("[i] Сохраненных данных не найдено. Холодильник пуст.");
  }

  console.log(`Для завершения введите '${STOP_WORDS.join(" / ")}'.`);
  console.log("Уникальная запись: 'Наименование + Дата'. Для удаления введите количество 0.\n");

  while (true) {
    const name = await askName(rl, "Введите наименование продукта: ");
    const nameLower = name.toLowerCase();

    if (STOP_WORDS.includes(nameLower)) break;

    let validExpDate;
    while (true) {
      const expDateInput = await rl.question(`Введите срок годности "${name}" (YYYY-MM-DD): `);
      const trimmedDate = expDateInput.trim();
      
      if (!isValidDate(trimmedDate)) {
        console.log("Ошибка: несуществующая дата или неверный формат. Используйте реальную дату (YYYY-MM-DD).");
        continue;
      }
      validExpDate = trimmedDate;
      break; 
    }

    // Find existing product by name and expiration date
    const productIdx = fridge.findIndex(
      (p) => p.name.toLowerCase() === nameLower && p.expDate === validExpDate
    );
    const exists = productIdx !== -1;

    if (exists) {
      console.log(`(В наличии: ${fridge[productIdx].count} шт. по ${fridge[productIdx].price}$)`);
    }

    const validCount = await askNumber(rl, `Введите итоговое количество "${name}": `);

    // Delete product if count is 0
    if (validCount === 0) {
      if (exists) {
        removeProduct(fridge, productIdx);
        console.log(`Партия "${name}" успешно удалена.`);
      } else {
        console.log(`Партия не найдена.`);
      }
      continue;
    }

    // Check expiration date against today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(validExpDate) < today) {
      console.log(`Ошибка: Срок годности (${validExpDate}) истек. Мы не добавляем просроченные товары.`);
      continue;
    }

    const validPrice = await askNumber(rl, `Введите цену "${name}": `);

    // Save or update product
    addOrUpdateProduct(fridge, productIdx, name, validCount, validPrice, validExpDate);
    
    if (exists) {
      console.log(`Данные обновлены.`);
    } else {
      console.log(`Добавлена новая партия.`);
    }
  }

  rl.close();

  // Safely write to files
  try {
    await writeToJsonFile(JSON_FILE, fridge);
    await writeToCsvFile(CSV_FILE, fridge);
    console.log(`\nДанные сохранены в файлы JSON и CSV.`);
    displayFridgeContents(fridge);
  } catch (error) {
    console.error("Ошибка при сохранении файлов:", error.message);
  }
}

runFridgeApp();