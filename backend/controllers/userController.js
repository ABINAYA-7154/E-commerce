const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      message: 'User registered successfully',
      user: user.toSafeObject(),
      token: generateToken(user),
    });
  } catch (err) {
    console.error(`[REGISTER] ${req.originalUrl} ❌`, err.stack);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: user.toSafeObject(),
      token: generateToken(user),
    });
  } catch (err) {
    console.error(`[LOGIN] ${req.originalUrl} 🔥`, err.stack);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ use .id not ._id from JWT payload
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user.toSafeObject());
  } catch (err) {
    console.error(`[PROFILE] ${req.originalUrl} ❌`, err.stack);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Admin access
exports.getAdminData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const user = await User.findById(req.user.id); // ✅ retrieve full user for toSafeObject
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Welcome to Admin Panel',
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error(`[ADMIN] ${req.originalUrl} ❌`, err.stack);
    return res.status(500).json({ error: 'Admin access failed' });
  }
};
