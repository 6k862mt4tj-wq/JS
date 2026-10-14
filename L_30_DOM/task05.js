console.log("task05 run");

const database=[];
let currentId=0;

// 1, Яблоко, 12.50

function saveProduct(title, price){

    if (typeof (title) !== 'string' || title.trim()==='')
        throw new Error('Название должно быть не пустой строкой');

    if (typeof (price) !== 'number' || price<0)
        throw new Error('Цена должна быть' +
            ' неотрицательным числом');

    database.push({
        id: ++currentId,
        title: title,
        price: price
    });

}

saveProduct('Яблоко', 12.50);
saveProduct('Груша', 15.50);
saveProduct('Персик', 10.50);

console.log(database);

try {
    saveProduct('Апельсин', -10);
} catch (error) {
    console.log(error.message);
}

try {
    saveProduct('       ', 10.1);
} catch (error) {
    console.log(error.message);
}

console.log("=====================");
console.log(database);

console.log("task05 end")