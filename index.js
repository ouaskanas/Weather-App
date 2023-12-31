const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const app = express();
const API_KEY = process.env.API_KEY;
const API_IMG = process.env.IMG_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/error', function(req, res) {
    res.sendFile(path.join(__dirname, 'error.html'));
});


app.get('/weather', function (req, res) {
    const address = req.query.address;

    if (!address) {
        return res.status(400).json({ error: 'City not provided' });
    }

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
            longitude: weatherData.coord.lon,
            latitude: weatherData.coord.lat
        };

        const coordinates = " " + coord.latitude + ", " + coord.longitude;

        res.json({
            cityName: cityName,
            temperature: temperature,
            sunsetTime: sunsetTime,
            coordinates: coordinates,
            image: firstPhotoUrl
        });
    })).catch(error => {
        console.error(error);
        return res.redirect('/error')
    });
});

const port = 3000;
app.listen(port, function () {
    console.log("Le port utilisé est : " + port);
});
