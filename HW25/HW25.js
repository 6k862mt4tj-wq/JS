
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

async function writeToJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

async function appendToJsonFile(filePath, data) {
  const fileData = await readFile(filePath, "utf-8");
  const existingData = JSON.parse(fileData);
  const updatedData = [...existingData, ...data];
  await writeToJsonFile(filePath, updatedData);
}

async function readFromJsonFile(filePath) {
  const fileData = await readFile(filePath, "utf-8");
  return JSON.parse(fileData);
}

function addOrUpdateProduct(fridge, name, count, price, expDate) {
    //  milk 3.0 15.2 2026-12-31     date-ISO format  YYYY-MM-DD
  const idx = fridge.findIndex((product) => product.name === name);
  if (idx !== -1) {
    fridge[idx].count += count;
  } else {
    fridge.push({ name, count, price, expDate });
  }
}

function removeProduct(fridge, name) {
  const idx = fridge.findIndex((product) => product.name === name);
  if (idx !== -1) {
    fridge.splice(idx, 1);
  }
}

function displayFridgeContents(fridge) {
    console.log("=== Содержимое холодильника ===");
    let count = 1;
    if (fridge.length === 0) {
        console.log("Холодильник пуст.");
    } else {
        fridge.forEach((product) => {
            console.log(`${count++}. ${product.name}: ${product.count}:
                 ${product.price} $, expDate: ${product.expDate}`);
        });
    }
}

async function displayFileJsonContents(filePath) {
    const fileData = await readFile(filePath, "utf-8");
      console.log("Данные из файла:", fileData);
}   

async function runFridgeApp(fileName, stopWords) {
  const rl = readline.createInterface({ input, output });
  const fridge = [];

  console.log("Программа для учета продуктов в холодильнике.");
  console.log(
    "Введите продукты в холодильнике. Для завершения введите  ", stopWords.join(", "), " (без учёта регистра)."
  );

  while (true) {
    const name = await rl.question("Введите наименование продукта: ");
    const trimmedName = name.trim();

    // --- Пункт 2: несколько стоп-слов, без учёта регистра ---
   
    if (stopWords.includes(trimmedName.toLowerCase())) {
      break;
    }

    if (trimmedName === "") {
      // Проверка на пустую строку
      console.log(
        "Наименование продукта не может быть пустым. Попробуйте снова.",
      );
      continue;
    }

    const countInput = await rl.question(
      `Введите количество продукта "${trimmedName}": `,
    );
    const count = +countInput.trim(); // "12ю5" -->> NaN

    if (Number.isNaN(count)) {
      console.log("Количество введено некорректно. Попробуйте снова.");
      continue;
    }

    const priceInput = await rl.question(
      `Введите цену продукта "${trimmedName}": `,
    );
    const price = +priceInput.trim(); // "12ю5" -->> NaN

    if (Number.isNaN(price)) {
      console.log("Цена введена некорректно. Попробуйте снова.");
      continue;
    }

    const expDateInput = await rl.question(
      `Введите срок годности продукта "${trimmedName}" (YYYY-MM-DD): `,
    );
    const expDate = expDateInput.trim();

    // Ищем, есть ли уже такой продукт в массиве
    const idx = fridge.findIndex((product) => product.name === trimmedName);

    if (idx !== -1 && count === 0) {
      removeProduct(fridge, trimmedName);
      console.log(`Продукт "${trimmedName}" удалён из списка.`);
    } else if (idx !== -1) {
      fridge[idx].count += count;
      fridge[idx].price = price;
      fridge[idx].expDate = expDate;
      console.log(
        `Количество продукта "${trimmedName}" обновлено:`,
        fridge[idx],
      );
    } else {
      fridge.push({ name: trimmedName, count, price, expDate });
      console.log("Продукт добавлен:", { name: trimmedName, count, price, expDate });
    }

    console.log("Текущий список продуктов:");
    console.table(fridge);
  }

  rl.close(); // Закрываем интерфейс readline после завершения ввода данных

  if (fridge.length > 0) {
    const filePath = path.resolve(fileName); // Путь к файлу в корне проекта
    try {
      // 1. Сохраняем данные в файл
      await writeFile(filePath, JSON.stringify(fridge, null, 2), "utf-8");
      console.log(`Данные о продуктах сохранены в файл: ${filePath}`);

      // 2. Читаем данные из файла
      console.log("Считываем данные из файла...");
      const fileData = await readFile(filePath, "utf-8");
      console.log("Данные из файла:", fileData);

      // 3. Преобразуем данные из JSON в объект JavaScript
      const saveProducts = JSON.parse(fileData);
      console.log("Данные из файла (объект):", saveProducts);

      // 4. Выводим список продуктов с их количеством красиво
      console.log("1. Список продуктов в холодильнике:");
      saveProducts.forEach((product) => {
        console.log(`- ${product.name}: ${product.count}`);
      });
      console.log("2. Список продуктов в холодильнике:");
      console.table(saveProducts);
    } catch (error) {
      console.error("Ошибка при работе с файлом:", error.message);
    }
  } else {
    console.log("Список продуктов пуст. Данные не были сохранены.");
  }
}

const fileName = "fridge.json";
const stopWords = ["exit", "выход", "стоп", "stop"];
runFridgeApp(fileName, stopWords);


/*
## HW-25-TEXT
Главная цель этого задания — сделать код программы понятнее и аккуратнее. 
Сейчас функция `runFridgeApp` перегружена: она сама ищет элементы в массиве, 
вручную перезаписывает данные, сама читает и сохраняет файлы. При этом в 
самом начале файла у вас уже написаны отличные функции-помощники, которые 
пока почти не используются.

Ваша задача — провести рефакторинг и переписать основную функцию так, 
чтобы она поручала всю черновую работу этим готовым вспомогательным 
инструментам.

**Что именно нужно сделать:**

* **Передать работу с массивом помощникам.** Внутри цикла `while` вы сейчас 
вручную ищете индекс продукта и меняете массив. Замените эту логику на 
вызовы функций `removeProduct` и `addOrUpdateProduct`. При необходимости 
немного доработайте `addOrUpdateProduct`, чтобы она умела обновлять не 
только количество, но также цену и срок годности.
* **Использовать готовые функции для файлов.** В конце программы замените 
прямые вызовы `writeFile` на готовую утилиту `writeToJsonFile`. А вместо 
цепочки из `readFile` и `JSON.parse` задействуйте функции `readFromJsonFile` 
и `displayFileJsonContents`.
* **Убрать дублирование вывода.** В самом конце кода вы снова перебираете 
массив через `forEach`, чтобы напечатать список. Удалите этот дублирующий 
цикл и вместо него просто вызовите `displayFridgeContents`.

В результате функция `runFridgeApp` должна стать простой и понятной: она 
будет отвечать только за общение с пользователем (задавать вопросы и 
получать ответы), а все операции с файлами и структурой данных уполномочены 
делать соответствующие вспомогательные функции.

*/