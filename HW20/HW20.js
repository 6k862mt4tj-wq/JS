/*
HW_20_TEXT
1.Создайте массив на 10 строк.

2.Создайте функцию comparator(a,b), которая  принимает 2 строки  и 
возвращает 1 - если первое строка длиннее, -1 если вторая строка длиннее, 
0 если равны.  
Используйте синтаксис function declaration, вызовите эту фкнкцию и 
напечатайте результат.
Напишите эту эе функцию используя Function Expression и Arrow Function  
3.Напишите функцию, которая принимает массив и функуию-компаратор, 
и возвращает самое большое значение в массиве. Вызовите эту функцию, передав 
ей массив строк, полученный в первой задаче и функцию, написанную во второй задаче.
*/

const strings = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"];

function comparatorDec(a, b) {
  if (a.length > b.length) {
    return 1;
  } else if (a.length < b.length) {
    return -1;
  } else {
    return 0;
  }
}
const comparatorExp = function(a, b) {
  if (a.length > b.length) {
    return 1;
  } else if (a.length < b.length) {
    return -1;
  } else {
    return 0;
  }
}
const comparatorArrow = (a, b) => {
  if (a.length > b.length) {
    return 1;
  } else if (a.length < b.length) {
    return -1;
  } else {
    return 0;
  }
}
console.log("Result Dec, Exp, Arrow:", comparatorDec("apple", "banana"), comparatorExp("apple", "banana"), comparatorArrow("apple", "banana"));

const maxString = strings.reduce((max, curr) => curr.length > max.length ? curr : max);
console.log("Longest string:", maxString);
