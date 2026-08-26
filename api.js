async function printWeather() {
    const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=44.49&longitude=20.27&current_weather=true');
        console.log(response);
    }
    printWeather();
    