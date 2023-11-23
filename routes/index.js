// routes/index.js
const express = require('express');
const Product = require('../models/product');
const isAuthenticated = require('../middleware/is-auth');
const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  const pCount = await Product.countDocuments()
  res.render('dashboard', { user: req.user, pCount });
});

module.exports = router;
