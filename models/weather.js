const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    userID : String,
    city: String,
    temperature: Number,
    description: String,
    icon: String,
    date: { type: Date, default: Date.now },
    lat: Number,
    lon: Number,
    info: JSON
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
