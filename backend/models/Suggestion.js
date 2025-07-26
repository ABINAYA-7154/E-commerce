// models/Suggestion.js

const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Suggestion', suggestionSchema);
