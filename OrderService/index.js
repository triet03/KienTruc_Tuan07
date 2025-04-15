require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Order = require('./models/Order');

const app = express();
app.use(express.json());
connectDB();

// Create Order
app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get one order
app.get('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ error: 'Order not found' });
});

// Update order
app.put('/orders/:id', async (req, res) => {
  const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete order
app.delete('/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🚀 Order Service on port ${PORT}`));
