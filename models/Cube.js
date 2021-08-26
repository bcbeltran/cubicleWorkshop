const mongoose = require('mongoose');
const Accessory = require('./Accessory');

const cubeSchema = new mongoose.Schema({
    creatorId: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, default: "https://i.pinimg.com/originals/bd/e4/13/bde413736324d96444b8ca923d57cce5.jpg"},
    difficulty: {type: Number, required: true},
    accessories: [],
});

const Cube = mongoose.model('Cube', cubeSchema);

module.exports = Cube;