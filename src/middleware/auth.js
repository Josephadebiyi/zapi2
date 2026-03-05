const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User'); // Reusing User or we can have an Admin model
// Assuming standard business admins
const Business = require('../models/Business');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, env.JWT_SECRET || 'fallback_secret_for_dev');

        // For the dashboard, the user is likely the business owner
        req.businessId = decoded.businessId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
