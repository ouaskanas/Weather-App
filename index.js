const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const app = express();
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'Weather.html', 'index.html'));
});

app.get('/weather', function (req, res) {
    const address = "Casablanca";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`;

    axios.get(url).then(response => {
        const data = response.data;
        const cityName = data.name;
        const temperature = (data.main.temp - 273.15).toFixed(2);
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        res.json({
            cityName: cityName,
            temperature: temperature,
            sunsetTime: sunsetTime
        });
    })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur de données' });
        });
});



const port = 3000;
app.listen(port, function () {
    console.log("le port utilisé est : " + port);
});
