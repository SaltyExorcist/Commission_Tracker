const mongoose = require('mongoose');

const salesRepSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('SalesRep', salesRepSchema);
