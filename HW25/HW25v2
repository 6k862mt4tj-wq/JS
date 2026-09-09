import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const JSON_FILE = path.resolve("fridge.json");
const CSV_FILE = path.resolve("fridge.csv");
const STOP_WORDS = ["exit", "выход", "стоп", "stop"];

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


async function askNumber(rl, questionText) {
  const answer = await rl.question(questionText);
  const number = Number(answer.trim());
  return Number.isNaN(number) ? 0 : number;
}

function displayFridgeContents(fridge) {
  console.log("\n1. Список продуктов в холодильнике (строки):");
  if (fridge.length === 0) {
    console.log("Холодильник пуст.");
  } else {
    fridge.forEach((p) => {
      console.log(`- ${p.name}: ${p.count} шт. | ${p.price} $ | Годен до: ${p.expDate}`);
    });
  }
  
  console.log("\n2. Список продуктов в холодильнике (таблица):");
  console.table(fridge);
}

function addOrUpdateProduct(fridge, idx, name, count, price, expDate) {
  if (idx !== -1) {
    fridge[idx].count = count;
    fridge[idx].price = price;
    fridge[idx].expDate = expDate;
  } else {
    fridge.push({ name, count, price, expDate });
  }
}

function removeProduct(fridge, idx) {
  if (idx !== -1) {
    fridge.splice(idx, 1);
  }
}


async function runFridgeApp() {
  const rl = readline.createInterface({ input, output });
  const fridge = [];

  console.log("\n=== Программа учета продуктов ===");
  console.log(`Для завершения ввода введите '${STOP_WORDS.join(" / ")}'.`);
  console.log("При вводе количества 0 — продукт удаляется.\n");

  while (true) {
    let name = await rl.question("Введите наименование продукта: ");
    name = name.trim();
    const nameLower = name.toLowerCase();

    if (STOP_WORDS.includes(nameLower)) break;

    if (!name) {
      console.log("Наименование не может быть пустым. Попробуйте снова.");
      continue;
    }

    const productIdx = fridge.findIndex((p) => p.name.toLowerCase() === nameLower);
    const exists = productIdx !== -1;
    const validCount = await askNumber(rl, `Введите количество "${name}": `);

    if (validCount === 0) {
      if (exists) {
        removeProduct(fridge, productIdx);
        console.log(`Продукт "${name}" успешно удален.`);
      } else {
        console.log(`Продукт "${name}" не был добавлен (количество 0).`);
      }
      continue;
    }

    const validPrice = await askNumber(rl, `Введите цену "${name}": `);

    const expDateInput = await rl.question(`Введите срок годности "${name}" (YYYY-MM-DD): `);
    const validExpDate = expDateInput.trim() || "Не указан";

    addOrUpdateProduct(fridge, productIdx, name, validCount, validPrice, validExpDate);
    
    if (exists) {
      console.log(`Данные продукта "${name}" обновлены.`);
    } else {
      console.log(`Продукт добавлен: { ${name} | ${validCount} шт. | ${validPrice}$ }`);
    }
  }

  rl.close();

  if (fridge.length > 0) {
    try {
      await writeToJsonFile(JSON_FILE, fridge);
      await writeToCsvFile(CSV_FILE, fridge);
      
      console.log(`\nДанные сохранены в файл: ${JSON_FILE}`);
      console.log(`Данные сохранены в файл: ${CSV_FILE}\n`);

      const saveProducts = await readFromJsonFile(JSON_FILE);
      displayFridgeContents(saveProducts);
      
    } catch (error) {
      console.error("Ошибка при работе с файлами:", error.message);
    }
  } else {
    console.log("Список пуст. Данные не сохранены.");
  }
}

runFridgeApp();