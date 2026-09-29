// data/db.js

import { readFromJsonFile, writeToJsonFile } from "../services/fileService.js";
import { JSON_FILE } from "../config.js";

export const fridge = [];

export async function loadInitialData() {
 
  const parsedData = await readFromJsonFile(JSON_FILE);
  
  fridge.length = 0;
  fridge.push(...parsedData);

  console.log(`[DB] База данных успешно загружена. Продуктов: ${fridge.length}`);
}

export async function saveFridgeData() {
  
  await writeToJsonFile(JSON_FILE, fridge);
}