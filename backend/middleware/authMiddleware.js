const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Protect route middleware
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.warn(`[AUTH] User ID ${decoded.id} not found`);
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user; // Attach user to req
      next();
    } catch (error) {
      console.error(`[AUTH] Token error:`, error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
});

// Admin-only middleware
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  console.warn(`[AUTH] Access denied for user ${req.user?.email || 'unknown'}`);
  return res.status(403).json({ error: 'Access denied. Admin only.' });
});

module.exports = { protect, adminOnly };
