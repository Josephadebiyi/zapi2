const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    try {
        if (!env.MONGODB_URI) {
            console.warn('MongoDB URI is not defined. Skipping DB connection.');
            return;
        }
        await mongoose.connect(env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
