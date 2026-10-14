console.log("task02 run");

function getJsonFromString(content){
    const json = JSON.parse(content);
    return json;
}

let text='{"username":"John","age":25}';
let result = getJsonFromString(text);
console.log(result);

text='{username:"John","age":25}';// ERROR
result = getJsonFromString(text);
console.log(result);

console.log("task02 end");