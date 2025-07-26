// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');

// 🎯 Token generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// 🧾 Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  console.log('📝 Registration payload:', { name, email, role });

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    console.warn('⚠️ Missing or empty registration fields');
    return res.status(400).json({ error: 'All fields required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.warn(`⚠️ Duplicate user registration attempt: ${email}`);
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  const user = await User.create({
    name: name.trim(),
    email: email.trim(),
    password: hashedPassword,
    role,
  });

  const token = generateToken(user._id, user.role);
  console.log(`✅ User registered: ${email} as ${role}`);

  return res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
}));

// 🔐 Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt for:', email);

  if (!email?.trim() || !password?.trim()) {
    console.warn('⚠️ Missing credentials');
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = await User.findOne({ email: email.trim() });
  if (!user) {
    console.warn(`❌ No user found with email: ${email}`);
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) {
    console.warn(`❌ Invalid password for: ${email}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);
  console.log(`Login successful for: ${email} | Role: ${user.role}`);

  return res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
}));

// 🙋 Profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  console.log(`🧾 Profile requested by: ${req.user.email}`);
  const user = await User.findById(req.user._id);
  if (!user) {
    console.warn(`❌ Profile not found for ID: ${req.user._id}`);
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}));

// ⭐ Admin-only route
router.get('/admin', protect, asyncHandler(async (req, res) => {
  console.log('🔍 Admin route accessed by:', req.user.email, '| Role:', req.user.role);
  
  if (req.user.role !== 'admin') {
    console.warn('❌ Access denied - not admin');
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  console.log('Admin access granted');
  return res.json({
    message: 'Welcome to Admin Panel',
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
}));

module.exports = router;
