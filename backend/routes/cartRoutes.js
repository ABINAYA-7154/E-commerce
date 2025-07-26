const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Cart = require('../models/cartModel');

// Add items to cart (append or increment)
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid cart items' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items });
    } else {
      items.forEach(newItem => {
        const matchIndex = cart.items.findIndex(
          item => item.name === newItem.name && item.category === newItem.category
        );

        if (matchIndex !== -1) {
          cart.items[matchIndex].quantity += newItem.quantity || 1;
        } else {
          cart.items.push({ ...newItem, quantity: newItem.quantity || 1 });
        }
      });
    }

    await cart.save();
    console.log(`🛒 Cart POST updated for ${req.user.email}:`, cart.items.length);
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error('❌ Cart POST error:', err.stack);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Fetch current cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    console.log(`📦 Cart GET for ${req.user.email}: ${cart.items.length} items`);
    return res.status(200).json({ cart });
  } catch (err) {
    console.error('❌ Cart GET error:', err.stack);
    return res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Replace cart with new items
router.put('/', protect, async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: items || [] });
    } else {
      cart.items = items || [];
    }

    await cart.save();
    console.log(`🔄 Cart PUT updated for ${req.user.email}: ${cart.items.length} items`);
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error('❌ Cart PUT error:', err.stack);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
});

module.exports = router;
