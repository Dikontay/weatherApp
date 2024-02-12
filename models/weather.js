const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    userID : String,
    city: String,
    temperature: Number,
    description: String,
    icon: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lat: Number,
    lon: Number,
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
