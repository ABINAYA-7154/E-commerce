const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 🛒 POST: Create new order
router.post('/', protect, async (req, res) => {
  const { name, email, items, amount } = req.body;

  if (!req.user || !req.user._id) {
    console.warn('⚠️ Unauthorized order attempt — no user on request');
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  if (!name || !email || !Array.isArray(items) || items.length === 0 || !amount) {
    console.warn('⚠️ Invalid order payload:', req.body);
    return res.status(400).json({ error: 'Incomplete order data' });
  }

  try {
    const newOrder = await Order.create({
      user: req.user._id,
      name,
      email: email.toLowerCase().trim(),
      items,
      amount
    });

    console.log(`Order created for ${email} (${items.length} items)`);
    return res.status(201).json(newOrder);
  } catch (err) {
    console.error('❌ Order POST error:', err.stack);
    return res.status(500).json({ error: 'Failed to save order' });
  }
});

// 📦 GET: Fetch orders
router.get('/', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { user: req.user._id };
    const orders = await Order.find(query);

    console.log(`📦 Orders fetched for ${req.user.email}: ${orders.length}`);
    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Order GET error:', err.stack);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ❌ DELETE: Admin deletes order
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      console.warn(`⚠️ Order not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`🗑️ Order deleted: ${req.params.id}`);
    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('❌ Order DELETE error:', err.stack);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ PUT: Confirm an order
// ✅ PUT: Confirm order
router.put('/confirm/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      console.warn(`⚠️ Confirm failed — no order with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    order.confirmed = true;
    await order.save();

    console.log(`Order confirmed: ${req.params.id}`);
    return res.status(200).json({ message: 'Order confirmed', order });
  } catch (err) {
    console.error('❌ Confirm error:', err.stack);
    res.status(500).json({ error: 'Order confirmation failed' });
  }
});

module.exports = router;
