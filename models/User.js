const mongoose = require('mongoose');

// Admin Schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', adminSchema);
