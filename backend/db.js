// db.js

const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { host, port, name } = conn.connection;
    console.log(`✅ MongoDB connected at ${host}:${port} → ${name}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.stack || err.message);
    process.exit(1); // Exit to trigger any container or PM2 restarts
  }
};

module.exports = connectDB;
