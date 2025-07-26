// routes/suggestionRoutes.js

const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 💡 POST: Submit a new suggestion (public access)
router.post('/', async (req, res) => {
  const { name, message } = req.body;
  console.log('📨 Incoming suggestion payload:', { name, message });

  if (!name?.trim() || !message?.trim()) {
    console.warn('⚠️ Empty or missing name/message');
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    const newSuggestion = await Suggestion.create({
      name: name.trim(),
      message: message.trim()
    });
    console.log(`✅ Suggestion saved from ${newSuggestion.name}`);
    return res.status(201).json(newSuggestion);
  } catch (err) {
    console.error('❌ Suggestion POST error:', err.stack);
    return res.status(500).json({ error: 'Failed to save suggestion' });
  }
});

// 📋 GET: Fetch all suggestions (public)
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    console.log(`📦 Returned ${suggestions.length} suggestions`);
    return res.status(200).json(suggestions);
  } catch (err) {
    console.error('❌ Suggestion GET error:', err.stack);
    return res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// 🗑️ DELETE: Admin-only delete by suggestion ID
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Suggestion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn(`⚠️ No suggestion found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    console.log(`🗑️ Deleted suggestion from ${deleted.name}`);
    return res.status(200).json({ message: '✅ Suggestion deleted successfully' });
  } catch (err) {
    console.error('❌ Suggestion DELETE error:', err.stack);
    return res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

module.exports = router;
