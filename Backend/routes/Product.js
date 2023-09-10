const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  Seller:String,
  category: String,
  location: String,
  deliveryTime: String,
  rating: Number,
  comment: String,
  image: String,
});

module.exports = mongoose.model('Product', productSchema);
