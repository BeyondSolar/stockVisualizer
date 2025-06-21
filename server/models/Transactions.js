const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    symbol: {type: String, required: true},
    quantity: {type: Number, required: true},
    pricePerUnit: { type: Number, required: true },
    type: {type: String, enum:['buy', 'sell'], required:true},
    timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Transaction', transactionSchema);