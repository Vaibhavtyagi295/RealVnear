const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  shopName: String,
  yearsInBusiness: String,
  shopDescription: String,
  category: String,
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  }],
  rating: String,
  comment: String,
  contactNumber: { type: String, unique: true },
  image: String,
  password: String,
  Products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // New fields
  shopOpenTime: String,
  shopCloseTime: String,
  price: Number,
  // Customize the data type based on your needs
  fullAddress: String,
  inquiries: [
    {
      phoneNumber: String,
      question: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // Field for storing user IDs who have liked the seller
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a 'User' model for user data
    },
  ],
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
