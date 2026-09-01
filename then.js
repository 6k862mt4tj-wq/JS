async function printWeather(latitude, longitude) {
    console.log("Широта: "+latitude+"\nДолгота: "+longitude);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    .then(response => response.json())
    // .then(d => console.log(d))
    .then(d => console.log("Скорость ветра: "+d.current_weather.windspeed+"\nТемпература: "+d.current_weather.temperature))
    .then(() => console.log("------Вот и все----------------"))
    .catch(err => console.log(err));
}
const latitude = 44.49;
const longitude = 20.27;
printWeather(latitude, longitude);
