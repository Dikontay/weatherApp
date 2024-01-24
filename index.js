const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
require('dotenv').config(); // make sure this is at the top

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var city_input 

app.get('/weather', (req, res) => {
    const city = req.query.city;
    city_input=city
    const apiKey = process.env.OPENWEATHERMAP_API_KEY; // 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    https.get(url, function(response) {
        let dataChunks = [];
        response.on("data", function(chunk) {
            dataChunks.push(chunk);
        }).on('end', function() {
            const data = Buffer.concat(dataChunks);
            const weatherData = JSON.parse(data);
            // Here you can extract more data from weatherData if needed
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const latitude = weatherData.coord.lat;
            const longitude = weatherData.coord.lon;
            const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

           

res.json({
    temp: temp,
    description: description,
    icon: imageURL,
    latitude: latitude,
    longitude: longitude
  });

        });
    }).on('error', function(e) {
        console.error(`Got an error: ${e.message}`);
        res.status(500).send('Error fetching weather data');
    });
});

app.get('/forecast', (req, res) => {
   
    const apiKey = process.env.WEATHERBIT_API_KEY; // Your API Key from Weatherbit
    const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(city_input)}&key=${apiKey}&days=10`;

    https.get(forecastUrl, (apiResponse) => {
        let dataChunks = [];
        
        apiResponse.on('data', (chunk) => {
            dataChunks.push(chunk);
        });

        apiResponse.on('end', () => {
            if (apiResponse.statusCode === 200) {
                const body = Buffer.concat(dataChunks);
                const forecastData = JSON.parse(body.toString());
                // Send the forecast data to the frontend
                res.json(forecastData);
            } else {
                // Handle HTTP response codes other than 200
                res.status(apiResponse.statusCode).send('Error fetching forecast data');
            }
        });
        
    }).on('error', (e) => {
        console.error(`Got an error: ${e.message}`);
        res.status(500).send('Error fetching forecast data');
    });
});

app.get('/forecast-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forecast.html'));
});

// Start the server
app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
