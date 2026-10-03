// services/fileService.js

import { writeFile, readFile } from "node:fs/promises";

let writeQueue = Promise.resolve();

export function writeToJsonFile(filePath, data) {
  
  const currentTask = writeQueue.then(async () => {
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  });

  writeQueue = currentTask.catch((err) => {
    console.error(`[FS] Ошибка очереди записи:`, err);
  });

  return currentTask;
}

export function writeToCsvFile(filePath, data) {
  const currentTask = writeQueue.then(async () => {
    if (!Array.isArray(data)) {
        throw new Error("Ошибка записи CSV: для экспорта ожидался массив.");
    }
    const csvHeader = "Наименование,Количество,Цена,Срок_годности\n";
    const csvData = data
      .map((p) => {
          const escapedName = p.name.replace(/"/g, '""');
          return `"${escapedName}",${p.count},${p.price},"${p.expDate}"`;
      })
      .join("\n");
      
    await writeFile(filePath, csvHeader + csvData, "utf-8");
  });

  writeQueue = currentTask.catch((err) => console.error(`[FS] Ошибка очереди CSV:`, err));
  return currentTask;
}

export function readFromJsonFile(filePath) {
    const currentTask = writeQueue.then(async () => {
        try {
            const fileContent = await readFile(filePath, "utf-8");
            const parsedData = JSON.parse(fileContent);
          
            if (!Array.isArray(parsedData)) {
                console.warn(`[!] Внимание: файл ${filePath} содержит не массив. Данные сброшены.`);
                return [];
            }
            
            return parsedData;
        } catch (error) {
            console.warn(`[!] Внимание: не удалось прочитать файл ${filePath} (возможно, он еще не создан).`);
            return []; 
        }
    });

    writeQueue = currentTask.catch((err) => {
        console.error(`[FS] Ошибка очереди чтения:`, err);
    });

    return currentTask;
}

export async function readHtmlFile(filePath) {
    try {
        return await readFile(filePath, "utf-8");
    } catch (error) {
        console.error(`[!] Критическая ошибка: не найден файл HTML ${filePath}`);
        return `<h1>Технические работы</h1><p>Интерфейс временно недоступен.</p>`;
    }
}