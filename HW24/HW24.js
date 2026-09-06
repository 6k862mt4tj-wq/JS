import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

async function runFridgeApp() {
  const rl = readline.createInterface({ input, output });
  const fridge = [];

  console.log("\nПрограмма для учета продуктов в холодильнике");
  console.log("Введите продукты в холодильнике. Для завершения введите 'exit / выход / стоп / stop'.");
  console.log("Чтобы изменить количество существующего продукта, введите его имя и укажите новое количество. При вводе количества 0 продукт будет удален.\n");

  while (true) {
    const name = await rl.question("Введите наименование продукта: ");
    const trimmedName = name.trim();

    if (["exit", "выход", "стоп", "stop"].includes(trimmedName.toLowerCase())) {
      break;
    }

    if (trimmedName === "") {
      console.log("Наименование продукта не может быть пустым. Попробуйте снова.");
      continue;
    }

    const countInput = await rl.question(`Введите количество продукта "${trimmedName}": `);
    const count = Number(countInput.trim());
    const validCount = Number.isNaN(count) ? 0 : count;

    const existingProductIndex = fridge.findIndex(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingProductIndex !== -1) {
      
      if (validCount === 0) {
        
        fridge.splice(existingProductIndex, 1);
        console.log(`Продукт "${trimmedName}" успешно удален из холодильника.`);
      } else {
        
        fridge[existingProductIndex].count = validCount;
        console.log(`Количество продукта "${trimmedName}" изменено на ${validCount}.`);
      }
    } else {
     
      if (validCount === 0) {
        console.log(`Продукт "${trimmedName}" не был добавлен, так как указано количество 0`);
      } else {
        
        fridge.push({
          name: trimmedName,
          count: validCount,
        });
        console.log(`Продукт добавлен: { name: '${trimmedName}', count: ${validCount} }`);
      }
    }
  }

  rl.close();

  if (fridge.length > 0) {
    const filePathJSN = path.resolve("fridge.json");
    const filePathCVS = path.resolve("fridge.csv");
    
    try {
      
      await writeFile(filePathJSN, JSON.stringify(fridge, null, 2), "utf-8");
      
      const csvHeader = "Наименование,Количество\n";
      const csvData = fridge.map((p) => `${p.name},${p.count}`).join("\n");
      await writeFile(filePathCVS, csvHeader + csvData, "utf-8");
      
      console.log(`\nДанные о продуктах сохранены в файл: ${filePathJSN}`);
      console.log(`Данные о продуктах сохранены в файл: ${filePathCVS}\n`);

      console.log("Считываем данные из файла fridge.json...");
      const fileData = await readFile(filePathJSN, "utf-8");

      const saveProducts = JSON.parse(fileData);

      console.log("\n1. Список продуктов в холодильнике (строки):");
      saveProducts.forEach((product) => {
        console.log(`- ${product.name}: ${product.count}`);
      });
      
      console.log("\n2. Список продуктов в холодильнике (таблица):");
      console.table(saveProducts);
      
    } catch (error) {
      console.error("Ошибка при работе с файлом:", error.message);
    }
  } else {
    console.log("Список продуктов пуст. Данные не были сохранены.");
  }
}

runFridgeApp();