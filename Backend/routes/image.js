const mongoose = require('mongoose');

// Define the schema for storing image data
const imageSchema = new mongoose.Schema({
    image: String,
  link: {
    type: String,

  },
});

// Create a model using the schema
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
