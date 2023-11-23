// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const upload = require('../middleware/upload');
const isAuthenticated = require('../middleware/is-auth');

// Get all products
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('pages/product-list', { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get product by ID
router.get('/edit/:id?', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const product = id ? (await Product.findById(id) ) : {}
    res.render('pages/product-entry', { product });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new product
router.post('/', upload, async (req, res) => {
  try {
    const { name, category, quantity, image } = req.body;
    const product = new Product({ name, category, quantity, image });

    // Save the product
    await product.save();
    res.json({ message: 'New product is created' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity } = req.body;
    await Product.findByIdAndUpdate(id, { name, category, quantity });
    res.json({ message: 'Product have been edited' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product have been deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
