// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  image: String
});

module.exports = mongoose.model('Product', productSchema);
