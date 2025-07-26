const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Women', 'Men', 'Teen Girl', 'Teen Boy', 'Girl Child', 'Boy Child'],
    required: true
  },
  image: {
    type: String, // base64 image string or file reference
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Design', designSchema);
