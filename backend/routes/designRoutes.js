const express = require('express');
const router = express.Router();
const multer = require('multer');
const Design = require('../models/Design');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ➕ Add new design (admin only)
router.post('/add', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file?.buffer?.toString('base64');

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newDesign = await Design.create({ name, description, price, category, image });
    console.log(`🧵 New design added: ${newDesign.name}`);
    return res.status(201).json(newDesign);
  } catch (err) {
    console.error('❌ Upload error:', err.stack);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// 📦 Fetch all designs (public)
router.get('/', async (req, res) => {
  try {
    const designs = await Design.find({});
    console.log(`📦 Design list fetched: ${designs.length} items`);
    return res.status(200).json({ designs });
  } catch (err) {
    console.error('❌ Design GET error:', err.stack);
    return res.status(500).json({ error: 'Fetch failed' });
  }
});

// ❌ Delete design by ID (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Design.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn(`🧵 Design not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Design not found' });
    }
    console.log(`🗑️ Design deleted: ${deleted.name}`);
    return res.status(200).json({ message: 'Design deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.stack);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
