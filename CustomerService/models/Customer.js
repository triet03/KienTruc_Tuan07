const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  address: String,
  phone: String
});

module.exports = mongoose.model('Customer', customerSchema);
