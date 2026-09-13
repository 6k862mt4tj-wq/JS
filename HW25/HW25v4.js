import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod"; // Импортируем библиотеку валидации

// === Конфигурация ===
const JSON_FILE = path.resolve("fridge.json");
const CSV_FILE = path.resolve("fridge.csv");
const STOP_WORDS = ["exit", "выход", "стоп", "stop"];

// === 1. СХЕМЫ ZOD (Центр контроля качества) ===

const NameSchema = z.string()
  .trim()
  .min(1, "Наименование не может быть пустым.")
  .regex(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/, "Разрешены только буквы, цифры, пробелы и дефис.");

const NumberSchema = z.number({
    invalid_type_error: "Введено не число. Попробуйте снова.",
  })
  .nonnegative("Значение не может быть отрицательным.");

const DateSchema = z.string()
  .date("Неверный формат (YYYY-MM-DD) или несуществующая дата.");

const ProductSchema = z.object({
  name: NameSchema,
  count: NumberSchema,
  price: NumberSchema,
  expDate: DateSchema
});

// === 2. ФАЙЛОВЫЕ ОПЕРАЦИИ И ВАЛИДАЦИЯ ЗАГРУЗКИ ===

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
    const result = ProductSchema.safeParse(item);
    if (result.success && result.data.count > 0) {
      validData.push(result.data);
    }
  });

  return validData;
}

// === 3. ПОМОЩНИКИ ДЛЯ КОНСОЛИ (Через Zod) ===

async function askName(rl, questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    const result = NameSchema.safeParse(answer);

    if (result.success) {
      return result.data.replace(/\s+/g, " ");
    } else {
      // Используем issues вместо errors
      console.log(`Ошибка: ${result.error.issues[0].message}`);
    }
  }
}

async function askNumber(rl, questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    if (answer.trim() === "") {
      console.log("Ошибка: Вы ничего не ввели. Укажите число.");
      continue;
    }

    const normalized = Number(answer.trim().replace(",", "."));
    const result = NumberSchema.safeParse(normalized);

    if (result.success) {
      return result.data;
    } else {
      // Используем issues вместо errors
      console.log(`Ошибка: ${result.error.issues[0].message}`);
    }
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

// === 4. УПРАВЛЕНИЕ МАССИВОМ ===

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

// === 5. ОСНОВНАЯ ПРОГРАММА ===

async function runFridgeApp() {
  const rl = readline.createInterface({ input, output });
  let fridge = [];

  console.log("\n=== Умный учет продуктов (Zod Edition) ===");

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
      
      const result = DateSchema.safeParse(expDateInput);
      if (result.success) {
        validExpDate = result.data;
        break;
      } else {
        // Используем issues вместо errors
        console.log(`Ошибка: ${result.error.issues[0].message}`);
      }
    }

    const productIdx = fridge.findIndex(
      (p) => p.name.toLowerCase() === nameLower && p.expDate === validExpDate
    );
    const exists = productIdx !== -1;

    if (exists) {
      console.log(`(В наличии: ${fridge[productIdx].count} шт. по ${fridge[productIdx].price}$)`);
    }

    const validCount = await askNumber(rl, `Введите итоговое количество "${name}": `);

    if (validCount === 0) {
      if (exists) {
        removeProduct(fridge, productIdx);
        console.log(`Партия "${name}" успешно удалена.`);
      } else {
        console.log(`Партия не найдена.`);
      }
      continue;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(validExpDate) < today) {
      console.log(`Ошибка: Срок годности (${validExpDate}) истек. Мы не добавляем просроченные товары.`);
      continue;
    }

    const validPrice = await askNumber(rl, `Введите цену "${name}": `);

    addOrUpdateProduct(fridge, productIdx, name, validCount, validPrice, validExpDate);
    
    if (exists) {
      console.log(`Данные обновлены.`);
    } else {
      console.log(`Добавлена новая партия.`);
    }
  }

  rl.close();

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