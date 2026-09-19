import { writeFile, readFile } from "node:fs/promises";

export async function writeToJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeToCsvFile(filePath, data) {
    if (!Array.isArray(data)) {
        console.error("[!] Ошибка записи CSV: для экспорта ожидался массив.");
        return; 
    }
  const csvHeader = "Наименование,Количество,Цена,Срок_годности\n";
  const csvData = data
    .map((p) => `"${p.name}",${p.count},${p.price},"${p.expDate}"`)
    .join("\n");
  await writeFile(filePath, csvHeader + csvData, "utf-8");
}

export async function readFromJsonFile(filePath) {
    try {
        const fileContent = await readFile(filePath, "utf-8");
        const parsedData = JSON.parse(fileContent);
      
        if (!Array.isArray(parsedData)) {
            console.warn(`[!] Внимание: файл ${filePath} содержит не массив. Данные сброшены.`);
            return [];
        }
        
        return parsedData;
    } catch (error) {
        console.warn(`[!] Внимание: не удалось прочитать файл ${filePath}. Данные сброшены.`);
        return []; 
    }
}

export async function readHtmlFile(filePath) {
    try {
        return await readFile(filePath, "utf-8");
    } catch (error) {
        console.error(`[!] Критическая ошибка: не найден файл ${filePath}`);
        return `<h1>Технические работы</h1><p>Интерфейс временно недоступен.</p>`;
    }
}