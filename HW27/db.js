import { readFromJsonFile } from "fileService.js";

let fridge = [];
export async function loadInitialData() {
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