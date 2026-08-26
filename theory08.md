## 📘 Урок 8. Data Processing (map / filter / reduce) — JavaScript

В этом конспекте ты познакомишься с методами обработки данных в массивах и научишься применять их для преобразования, фильтрации и анализа данных.

---

# 🧠 1. Что такое обработка данных

**Обработка данных** — это изменение, фильтрация или анализ элементов массива.

📌 Проще говоря:
мы берём массив и «что-то с ним делаем».

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3, 4];
```

---

👉 Можно:

* увеличить числа
* отфильтровать
* посчитать сумму

---

# 🎯 2. Зачем нужны методы массива

Ранее мы использовали циклы.
Теперь есть более удобный способ:

👉 встроенные методы массива

---

## 📌 Преимущества:

* код короче
* код понятнее
* меньше ошибок

---

# 🔄 3. Метод map

**map** — преобразует каждый элемент массива.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3];

let result = numbers.map(function(num) {
  return num * 2;
});
```

---

## 📊 Результат:

```javascript
[2, 4, 6]
```

---

👉 Каждый элемент изменился

---

# 🔍 4. Метод filter

**filter** — оставляет только подходящие элементы.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3, 4];

let result = numbers.filter(function(num) {
  return num > 2;
});
```

---

## 📊 Результат:

```javascript
[3, 4]
```

---

👉 Остались только элементы, подходящие под условие

---

# ➕ 5. Метод reduce

**reduce** — объединяет массив в одно значение.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3];

let sum = numbers.reduce(function(acc, num) {
  return acc + num;
}, 0);
```

---

## 📊 Результат:

```javascript
6
```

---

## 🧠 Как работает:

* `acc` — накопитель
* `num` — текущий элемент

---

---

# 🔎 6. Метод find

**find** — возвращает первый подходящий элемент.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3, 4];

let result = numbers.find(function(num) {
  return num > 2;
});
```

---

## 📊 Результат:

```javascript
3
```

---

👉 Только первый элемент

---

# ❓ 7. Метод some

**some** — проверяет, есть ли хотя бы один элемент.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3];

let result = numbers.some(function(num) {
  return num > 2;
});
```

---

## 📊 Результат:

```javascript
true
```

---

---

# ✔️ 8. Метод every

**every** — проверяет, подходят ли все элементы.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3];

let result = numbers.every(function(num) {
  return num > 0;
});
```

---

## 📊 Результат:

```javascript
true
```

---

---

# 🔁 9. Метод forEach

**forEach** — выполняет действие для каждого элемента.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3];

numbers.forEach(function(num) {
  console.log(num);
});
```

---

👉 Не возвращает новый массив

---

# 🔃 10. Метод sort

**sort** — сортирует массив.

---

## 📦 Пример:

```javascript
let numbers = [3, 1, 2];

numbers.sort(function(a, b) {
  return a - b;
});
```

---

## 📊 Результат:

```javascript
[1, 2, 3]
```

---

👉 Важно: изменяет исходный массив

---

# 🔗 11. Цепочки методов (chaining)

Можно объединять методы.

---

## 📦 Пример:

```javascript
let numbers = [1, 2, 3, 4, 5];

let result = numbers
  .filter(function(num) {
    return num > 2;
  })
  .map(function(num) {
    return num * 2;
  });
```

---

## 📊 Результат:

```javascript
[6, 8, 10]
```

---

👉 Сначала фильтрация → потом преобразование

---

# 🧪 12. Практический пример

```javascript
let products = [
  { name: "Phone", price: 300 },
  { name: "Laptop", price: 1000 },
  { name: "Tablet", price: 500 }
];

let result = products
  .filter(function(product) {
    return product.price > 400;
  })
  .map(function(product) {
    return product.name;
  });

console.log(result);
```

---

## 📊 Результат:

```javascript
["Laptop", "Tablet"]
```

---

# ⚠️ 13. Частые ошибки

## ❌ Забыли return в map

```javascript
numbers.map(function(num) {
  num * 2;
});
```

---

---

## ❌ Используют forEach вместо map

→ нет результата

---

---

## ❌ Неправильный reduce

→ ошибка в логике

---

---

## ❌ sort без функции

```javascript
[10, 2, 1].sort();
```

👉 результат некорректный

---

---

# 🧠 Важные выводы

* массивы можно обрабатывать без циклов
* основные методы:

  * map → преобразование
  * filter → фильтрация
  * reduce → сведение к одному значению
  * find → первый элемент
  * some → есть ли хотя бы один
  * every → все ли подходят
  * forEach → перебор
  * sort → сортировка
* методы можно объединять в цепочки
* порядок методов важен

---
