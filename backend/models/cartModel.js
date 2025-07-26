const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      category: { type: String },
      _id: false // ✅ Prevents subdocument IDs from cluttering
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
