const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const axios = require('axios')
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config(); 

const User = require('./models/user');
const Weather = require('./models/weather'); 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


 app.set('view engine', 'ejs')
 app.use(express.static('public'));
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());


app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true }
}));


app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/weather');
  }
  res.render('login');
});

app.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // console.log(user)
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send('Password is incorrect');
    }
    req.session.userId = user._id;

    req.session.user = user;
    if(user.isAdmin == true){
      res.redirect('/admin');
    }else{
      res.redirect('/weather');
    }
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});



app.get('/register', (req, res) => {
  res.render('register');
});


app.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    await user.save();

    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
}); 

app.get('/weather', async(req, res) => {

  if (!req.session.userId) {
    return res.redirect('/');
  }

  const user = req.session.user;
  const userId = req.session.userId;
  const weather = await Weather.find({ userID: userId })

  console.log(weather);
  res.render('index', { weather: weather, error: null, user: user});
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const urlka = `https://api.api-ninjas.com/v1/city?name=${city}`;
  try {

    const response = await axios.get(url);
    const { name, main, weather } = response.data;
    const weatherDescription = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const lat = response.data.coord.lat;
    const lon = response.data.coord.lon;
    const userId = req.session.userId;

    const responseData = await fetch(`https://api.api-ninjas.com/v1/city?name=${name}`, {
      method: 'GET',
      headers: {
          'X-Api-Key': "itxbtdMxH/atZ/eGQyizZg==DPUUqRM9AfeETKyW"
      }
  });

    const data = await responseData.json();
    const weatherCity = new Weather({ userID: userId, city: name, temperature: main.temp, description: weatherDescription, icon: iconUrl, date: new Date(), lat: lat, lon: lon, info: data[0]});
    await weatherCity.save();

  

    res.render('weather', { weather: weatherCity, error: null });
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.render('index', { weather: null, error: 'Error, please try again' });
  }
});




app.get('/admin', async(req, res) => {
  const users = await User.find()
  
  const user = req.session.user;
  res.render('admin', { users: users, user: user});
});


app.post('/addUser', async(req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    });

    await user.save();
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
});


app.post('/deleteUser/:userId', async(req, res) => {
  try {
    const user = await User .findByIdAndDelete(req.params.userId);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }

});


app.post('/editUser', async(req, res) => {
  try {
    console.log(req.body);

    const userId = req.body.userId;
    const username = req.body.username;
    if (req.body.isAdmin == 'true') {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
    const updatedDate = new Date();
    const user = await User.findByIdAndUpdate(userId, { username: username, isAdmin: isAdmin, updatedDate: updatedDate});
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));