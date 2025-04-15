require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Customer = require('./models/Customer');

const app = express();
app.use(express.json());
connectDB();

// Create
app.post('/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Read one
app.get('/customers/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) res.json(customer);
  else res.status(404).json({ error: 'Customer not found' });
});

// Update
app.put('/customers/:id', async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
app.delete('/customers/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Customer Service on port ${PORT}`));
