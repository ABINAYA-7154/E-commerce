// utils/generateToken.js

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {{ _id: string, role: string }} user
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  if (!user?._id || !user?.role) {
    console.warn('⚠️ Token generation skipped: missing _id or role');
    return '';
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
