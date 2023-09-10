// review.js (inside your models folder)
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name:String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

module.exports = mongoose.model('Review', reviewSchema);
