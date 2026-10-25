const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/devshelf_db';
    await mongoose.connect(mongoUrl);
    console.log(`[MongoDB] Connected successfully to ${mongoUrl}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    // Don't kill process so app can still run with warnings if mongo fails
  }
};

module.exports = connectMongo;
