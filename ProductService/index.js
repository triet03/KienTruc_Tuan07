require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// GET all products
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET product by ID
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// POST create new product
app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  const saved = await newProduct.save();
  res.status(201).json(saved);
});

// PUT update product
app.put('/products/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(204);
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(process.env.PORT, () => {
  console.log(`Product Service running on port ${process.env.PORT}`);
});
