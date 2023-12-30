const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const app = express();
const API_KEY = process.env.API_KEY;
const API_IMG = process.env.IMG_KEY;


app.use(express.static(path.join(__dirname, 'public')));

// function getimage(city) {
//     const url_img = `https://api.unsplash.com/photos/random?query=${city}&client_id=${API_IMG}&w=1080&h=720&orientation=landscape`;
//     axios.get(url_img)
//         .then(res => {
//             const firstPhotoUrl = res.data.urls?.regular || res.data.urls?.full;
//             console.log('URL de la première photo:', firstPhotoUrl);
//             return firstPhotoUrl; 
//         })
//         .catch(error => console.error('Erreur lors de la récupération des photos:', error));
//         res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
// }

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'Weather.html', 'index.html'));
});

app.get('/weather', function (req, res) {
    const address = "Essaouira";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`;
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${address}&client_id=${API_IMG}&w=1080&h=720&orientation=landscape`;

    axios.all([
        axios.get(weatherUrl),
        axios.get(unsplashUrl)
    ]).then(axios.spread((weatherResponse, unsplashResponse) => {
        const weatherData = weatherResponse.data;
        const cityName = weatherData.name;
        const temperature = (weatherData.main.temp - 273.15).toFixed(2);
        const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();

        const unsplashData = unsplashResponse.data;
        const firstPhotoUrl = unsplashData.urls?.regular || unsplashData.urls?.full;

        const coord = {
            longiture: weatherData.coord.lon,
            laptitude: weatherData.coord.lat
        };

        const coordonées = " " + coord.laptitude + ", " + coord.longiture;

        res.json({
            cityName: cityName,
            temperature: temperature,
            sunsetTime: sunsetTime,
            coordonées: coordonées,
            image: firstPhotoUrl
        });
    })).catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    });
});


const port = 3000;
app.listen(port, function () {
    console.log("le port utilisé est : " + port);
});