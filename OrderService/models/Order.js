const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: String,
  products: [
    {
      productId: String,
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['created', 'confirmed', 'shipped', 'cancelled'],
    default: 'created'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
