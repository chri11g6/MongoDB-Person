const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    age: { type: Number }
});

module.exports = mongoose.model('Person', personSchema);