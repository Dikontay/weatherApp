const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    description: String,
    icon: String,
    date: { type: Date, default: Date.now }
  });

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;