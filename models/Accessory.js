const mongoose = require('mongoose');
const Cube = require('./Cube');

const accessorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, default: "https://i.pinimg.com/originals/bd/e4/13/bde413736324d96444b8ca923d57cce5.jpg"},
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory;