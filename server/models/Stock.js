const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

stockSchema.index({ symbol: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
