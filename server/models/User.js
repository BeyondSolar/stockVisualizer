const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: {
    type: Number,
    default: 100000,
  },
});

module.exports = mongoose.model('User', userSchema);
