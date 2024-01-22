const express = require('express')

const bodyParser = require('body-parser')

const templatePath = require('path')

const port = 3000

const https = require('https')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(templatePath.join(__dirname + '/index.html'))
})



app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'));


app.get('/weather', (req, res) => {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=23ba82411c0aea65da3417ff3d608859&units=metric`;
    
    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            res.write(`
        <html>
        <head>
            <title>Weather Report</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #e0f2f1; padding: 20px;">
            <h1 style="color: #0d47a1;">Weather Forecast</h1>
            <h2 style="color: #1a237e;">${city}</h2>
            <p style="font-size: 20px;">The temperature is <strong>${temp} degrees Celsius</strong>.</p>
            <p style="color: #4a148c; font-size: 18px;">The weather is currently <em>${description}</em>.</p>
            <img src="${imageURL}" alt="Weather Icon" style="border: 5px solid #4a148c; border-radius: 10px; margin-top: 10px;">
            <footer>
                <p style="margin-top: 30px
;font-size: 12px; color: #424242;">Powered by Kassymova Sabina</p>
</footer>
</body>
</html>
`);
            res.send();


        });
    });
});


   






app.listen(port, () => console.log(`Listening port in http://localhost:${port}/`))
