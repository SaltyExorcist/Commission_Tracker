const mongoose = require('mongoose');

// Commission Schema
const CommissionSchema = new mongoose.Schema({
    customerName: String,
    contact: String,
    email: String,
    salesRep: String,
    service: String,
    numberOfPeople: Number,
    commission: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commission', CommissionSchema);
