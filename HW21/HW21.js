/*
HW_21-22_TEXT
1.
 
a) Создайте несколько объектов-продуктов. В каждом объекте
должно быть поле name (название), description(описание), price(цена),
info (функция, которая формирует строку вида:
`товар: notebook lenovo thinkpad; цена: 1283 описание: cpu intel core7, ram:16gb ...`
 
b) создайте конструктор для создания объектов-товаров.
Создайте несколько товаров
 
с) Создайте массив из товаров. Напишите функцию, которая
выводит в консоль информацию о всех товарах в виде:
```
Tовар 1
    name: notebook lenovo thinkpad
    price: 1283
    description: .....
    info: ....
```  
т.е. `поле: значение` При этом: поля, которые являются
функциями, нужно выводить результат работы функции
(не текст функции)
 
2.ADV****  Как обязательная на понедельник 31.08.2026
 
### 2
a)
Создай функцию-конструктор объектов Account(iban,owner, balance),
которая возвращает объект с:
- номер счета (iban)
- именем владельца (owner)
- балансом (balance)  
методами:
- **deposit**(amount) — пополнение счёта
- **withdraw**(amount) — снятие денег (если хватает баланса)
- **getBalance**() — вывод текущего баланса
 
Создайте несколько объектов счетов. Создайте массив из
счетов. Выведите информацию о всех счетах в консоль
 
b) напишите функцию, transfer, которая получает два счета,
и выполняет перевод между счетами вызывая методы deposit и
withdraw соответственно.
 
с) (чуть сложнее****************)
 В качестве результата функции transaer, в случае успешной
операции, должен cформироваться объект:
- account1 (счет списания),
- account2 (счет зачисления),
- amount (сумма)
- transactionInfo() (функция, которая выводит информацию о транзакции)  
 
Если транзакция прошла неуспешно, объект должен содержать
еще и поле error c информацией об ошибке. Естественно,
transactionInfo() должна в этом случае выводить информацию
о неуспешной транзакции. В случае, если транзакция успешна,
поля error не должно быть.
 
 
*/

//#1
item1 = {
    name: "notebook lenovo thinkpad",
    description: "cpu intel core7, ram:16gb, ssd:512gb",
    price: 1283,
    info: function() {
        return `item: ${this.name}; price: ${this.price} description: ${this.description}`;
    }
}; 
item2 = {
    name: "smartphone samsung galaxy s21",
    description: "cpu exynos 2100, ram:8gb, storage:128gb",
    price: 999,
    info: function() {
        return `item: ${this.name}; price: ${this.price} description: ${this.description}`;
    }
};
item3 = {
    name: "headphones sony wh-1000xm4",
    description: "wireless, noise-cancelling, over-ear",
    price: 349,
    info: function() {
        return `item: ${this.name}; price: ${this.price} description: ${this.description}`;
    }
};

function Product(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.info = function() {
        return `item: ${this.name}; price: ${this.price} description: ${this.description}`;
    };
}

const item4 = new Product("tablet apple ipad pro", "cpu apple m1, ram:8gb, storage:256gb", 799);
const item5 = new Product("smartwatch fitbit versa 3", "heart rate monitor, sleep tracking, GPS", 229);
const item6 = new Product("camera canon eos r5", "45MP full-frame mirrorless, 8K video recording", 3899);

items = [item1, item2, item3, item4, item5, item6];

function printItemsInfo(items) {
    items.forEach((item, index) => {
        console.log(`item ${index + 1}`);
        console.log(`    name: ${item.name}`);
        console.log(`    price: ${item.price}`);
        console.log(`    description: ${item.description}`);
        console.log(`    info: ${item.info()}`);
    });
}
printItemsInfo(items);

//#2
function Account(iban, owner, balance) {
    this.iban = iban;
    this.owner = owner;
    this.balance = balance;

    this.deposit = function(amount) {
        this.balance += amount;
    };

    this.withdraw = function(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    };

    this.getBalance = function() {
        return this.balance;
    };
}

const account1 = new Account("DE44500105170445678901", "John Doe", 1000);
const account2 = new Account("DE44500105170445678902", "Jane Smith", 1500);
const account3 = new Account("DE44500105170445678903", "Bob Johnson", 2000);

accounts = [account1, account2, account3];

function printAccountsInfo(accounts) {
    accounts.forEach((account, index) => {
        console.log(`Account ${index + 1}`);
        console.log(`    iban: ${account.iban}`);
        console.log(`    owner: ${account.owner}`);
        console.log(`    balance: ${account.getBalance()}`);
    });
}
printAccountsInfo(accounts);

function transfer(accountFrom, accountTo, amount) {
    const transaction = {
        account1: accountFrom,
        account2: accountTo,
        amount: amount,
        error: null,
        transactionInfo: function() {
            if (this.error) {
                return `Transaction failed: ${this.error}`;
            }
            return `Transaction successful: ${this.amount} transferred from ${this.account1.owner} to ${this.account2.owner}`;
        }
    };

    if (accountFrom.withdraw(amount)) {
        accountTo.deposit(amount);
    } else {
        transaction.error = "Insufficient funds";
    }

    return transaction;
}

const transaction1 = transfer(account1, account2, 500);
console.log(transaction1.transactionInfo());

const transaction2 = transfer(account1, account2, 2000);
console.log(transaction2.transactionInfo()); 

/*

let item1 = {
    name: "notebook lenovo thinkpad",
    price: 1283,
    description: "cpu intel core7, ram:16gb",
    info: infoFunction
}
 
 
console.log(item1);
console.log(item1.info());
 
let item2 = new Product("Acer N53",1600, "Игровой ноутбук");
item2.note = 'пробная партия';
console.log("------------------------");
console.log(item2);
console.log(item2.info());
 
 
//bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
function Product(name, price, description){
    this.name = name;
    this.price = price;
    this.description = description;
    this.info = infoFunction
}
 
function infoFunction(){
    return `товар: ${this.name}; цена: ${this.price} описание: ${this.description}`;
}
 
//ccccccccccccccccccccccccccccccccccccccccccccccccc
const arr = [item1, item2, new Product("Смартфон iphone 20pro","24 камеры",10000)];
console.log(arr);
console.log(arr[2]);
console.log("--------printArray----------------");
printArray(arr)
 
console.log("---------printArray2--------------");
printArray2(arr)
 
 
 
 
function printArray(arr){
    if(!Array.isArray(arr)){
        console.log("неопознанный параметр");
        return;
    } else {
        for(let i=0; i<arr.length; i++){
            console.log(`Товар ${i+1}`);
            let item = arr[i];
            for(let key in item){  
                let value = typeof(item[key])!=='function'? item[key]:item[key]();
                console.log(`   ${key}:${value}`)
            }
        }
 
    }
 
}
 
function printArray2(arr){
    if(!Array.isArray(arr)){
        console.log("неопознанный параметр");
        return;
    } else {
        arr.forEach((item, i) =>{
            console.log(`Товар ${i+1}`);
            for(let key in item){  
                let value = typeof(item[key])!=='function'? item[key]:item[key]();
                console.log(`   ${key}:${value}`)
            }
        })
 
    }
 
}

*/


function Account(iban, owner, balance){
    this.iban = iban;
    this.owner = owner;
    this.balance = balance;
    this.getBalance = function(){return this.balance;};
    //typeof NaN
    this.deposit = function(amount){
        if( typeof(amount)!=='number' || amount<=0 || !Number.isFinite(amount)){
            return false;
        } else {
            this.balance+=amount;
            return true;
        }
    };
    this.withdraw = function(amount){
        if( typeof(amount)!=='number' || amount<=0 || !Number.isFinite(amount)){
            return false;
        }
        if (this.balance<amount){
            return false;
        }

        this.balance-=amount;
        return true;

    }
};

function transfer(acc1,acc2, amount){
    //Step 1 - withdraw
    if(!acc1.withdraw(amount)) {
        //fail
        return new Transaction(acc1,acc2,amount,"не смогли списать");
    }
    //Step 2 - deposit
    if(!acc2.deposit(amount)){
            // fail
            return new Transaction(acc1,acc2,amount, "не смогли зачислить")
        }
    // Step 3 - success
    return new Transaction(acc1,acc2,amount);

}


function Transaction(acc1,acc2,amount,error ){
    this.account1 = acc1;
    this.account2 = acc2;
    this.amount = amount;
    if(error!==undefined){
        this.error = error;
    }

    this.transactionInfo = function(){
        const errorMessage = ("error" in this) ? ` error ${this.error}`:"";
        return (`Перевод со счета ${this.account1.iban} на ${this.account2.iban} на сумму ${this.amount}.`
            + errorMessage);

    };


}


const account1 = new Account("DE893788777343","jack",1000);
const account2 = new Account("FR893799777343","ann",1500);
const account3 = new Account("GB893790777343","Petya",700);
const account4 = new Account("IL893777677343","Olga",900);
 
//console.log(account1.getBalance());
//console.log(account1.withdraw("777"));

const accounts = [account1,account2,account3,account4];
function printAccounts(accounts){
    console.log("====================Accounts====================")
    for(let i=0; i<accounts.length; i++){
        console.log(`Account ${i+1}`);
        console.log(`   iban: ${accounts[i].iban} owner: ${accounts[i].owner} balance: ${accounts[i].getBalance()}`)
        console.log("-----------------")
    }
}

printAccounts(accounts);

const transaction1 = transfer(account1,account2, 500);
console.log(transaction1.transactionInfo());
console.log(account1.getBalance(), account2.getBalance());

const transaction2 = transfer(account3,account1, 1000);
console.log(transaction2.transactionInfo());
console.log(account3.getBalance(), account1.getBalance());
console.log(transfer(account4,account2, -1000).transactionInfo());
console.log(transfer(account4,account2, NaN).transactionInfo());
console.log(transfer(account4,account2, "1000").transactionInfo());
 