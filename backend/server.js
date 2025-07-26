// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const app = express();
const orderRoutes = require('./routes/orderRoutes');
// 🌱 Load environment variables
dotenv.config();

// 🔌 Connect to database
connectDB();

// 🔧 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 📦 Routes
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/designs', require('./routes/designRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/suggestions', require('./routes/suggestionRoutes'));
// Add more routes as needed

// 🚨 Catch-all test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// ⚠️ Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Admin panel at: http://localhost:${PORT}/api/users/admin`);
});

module.exports = app;
