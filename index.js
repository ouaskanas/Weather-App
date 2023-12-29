const express = require("express"); 
const axios = require("axios"); 
require("dotenv").config(); 

const app = express(); 
const API_KEY = process.env.API_KEY; 

app.get('/',function(req,res){
    res.send("hello Word")
}); 

app.get('/weather', function(req, res)
{
    const adress = "Casablanca"; 
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+adress+"&appid="+API_KEY; 

    axios.get(url).then(response=>{
        const data = response.data;
        const cityName = data.name;
        const temperature = (data.main.temp - 273.15).toFixed(2);
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        const message = `City Name: ${cityName}<br>Temperature: ${temperature}&deg;C<br>Sunset Time: ${sunsetTime}`;

        res.send(`<html><body><div id='container'><h1>${message}</h1></div></body></html>`);
    })
    .catch (error=>{console.error(error); 
    res.status(500).send('Erreur de données');});
}); 



port = 3000; 
app.listen(port,function(){
    console.log("le port utilisé est : "+port); 
}); 