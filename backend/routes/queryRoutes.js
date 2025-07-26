// routes/queryRoutes.js

const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 🔧 POST: Submit a new query (public access)
router.post('/', async (req, res) => {
  const { name, message } = req.body;
  console.log('🔍 Incoming query payload:', { name, message });

  if (!name?.trim() || !message?.trim()) {
    console.warn('⚠️ Missing or empty fields in query submission');
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    const newQuery = await Query.create({
      name: name.trim(),
      message: message.trim()
    });
    console.log(`✅ Query saved from ${newQuery.name}`);
    return res.status(201).json(newQuery);
  } catch (err) {
    console.error('❌ Query POST error:', err.stack);
    return res.status(500).json({ error: 'Failed to submit query' });
  }
});

// 🔍 GET: Admin-only fetch of all queries
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    console.log(`📋 Fetched ${queries.length} queries`);
    return res.status(200).json(queries);
  } catch (err) {
    console.error('❌ Query GET error:', err.stack);
    return res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// 🗑️ DELETE: Admin-only delete by query ID
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Query.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn(`⚠️ Query not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Query not found' });
    }
    console.log(`🗑️ Deleted query from ${deleted.name}`);
    return res.status(200).json({ message: '✅ Query deleted' });
  } catch (err) {
    console.error('❌ Query DELETE error:', err.stack);
    return res.status(500).json({ error: 'Failed to delete query' });
  }
});

module.exports = router;
