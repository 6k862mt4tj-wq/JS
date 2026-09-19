import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { validateName, validateNumber, validateDate } from "../HW27/validService.js";

// Создаем интерфейс здесь, пряча его от внешнего мира
const rl = readline.createInterface({ input, output });

export async function askName(questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    const check = validateName(answer);
    if (check.isValid) return check.data;
    console.log(`Ошибка: ${check.errorMessage}`);
  }
}

export async function askDate(questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    const check = validateDate(answer);
    if (check.isValid) return check.data;
    console.log(`Ошибка: ${check.errorMessage}`);
  }
}

export async function askNumber(questionText) {
  while (true) {
    const answer = await rl.question(questionText);
    if (answer.trim() === "") {
      console.log("Ошибка: Вы ничего не ввели. Укажите число.");
      continue;
    }
    const normalized = Number(answer.trim().replace(",", "."));
    const check = validateNumber(normalized);
    if (check.isValid) return check.data;
    console.log(`Ошибка: ${check.errorMessage}`);
  }
}

export function displayFridgeContents(fridge) {
  console.log("\n=== Список продуктов в холодильнике ===");
  if (fridge.length === 0) {
    console.log("Холодильник пуст.");
  } else {
    console.table(fridge);
  }
}

export function closeConsole() {
  rl.close();
}