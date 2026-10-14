console.log("task01 run")

function getSum(number1,number2){
    const sum = number1 + number2;
    return sum;
}

let value1=5;
let value2=10;

let result = getSum(value1,value2);
console.log(result);

value1 = 'Hello';
result = getSum(value1,value2);
console.log(result);

value1 = undefined;
result = getSum(value1,value2);
console.log(result);


console.log("task01 end");
