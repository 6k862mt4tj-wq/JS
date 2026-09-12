/*
HW_26_TEXT
Используя два информационных ресурса (API) - https://jsonplaceholder.typicode.com/users и https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.27&current_weather=true
1. Получить список пользователей (users) с ресурса https://jsonplaceholder.typicode.com/users
2. Для каждого пользователя получить его географические координаты (latitude и longitude)   
3. Используя эти координаты, получить текущую погоду для каждого пользователя с ресурса https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.27&current_weather=true
4. Определить пользователя с самой высокой температурой и вывести его имя, телефон  
 и температуру в консоль.
 Решите задачу с использованием 
 5.fetch  
 6.axios (для одного из запросов).
*/
import axios from "axios";  
async function returnUser(id){
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    const userData = await response.data;
    return userData;
}

const people = [];
for (let i = 1; i <= 10; i++) {
    const userData = await returnUser(i);
    let myObj={
        id: userData.id,
        name: userData.name,
        telephone: userData.phone,
        temperature:
        await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${userData.address.geo.lat}&longitude=${userData.address.geo.lng}&current_weather=true`)
        .then(response => response.json())
        .then(data => data.current_weather.temperature)
        }
    people.push(myObj);
};

people.sort((a, b) => b.temperature - a.temperature);
console.log(people[0]);