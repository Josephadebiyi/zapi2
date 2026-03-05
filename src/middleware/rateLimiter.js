const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware for API endpoints
 */

// General API rate limiter - 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
    }
});

// Strict limiter for auth endpoints - 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful requests
});

// Webhook limiter - 1000 requests per minute (high throughput)
const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000, // Allow high volume for webhooks
    message: {
        error: 'Webhook rate limit exceeded.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Registration limiter - 3 registrations per hour per IP
const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        error: 'Too many accounts created from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    authLimiter,
    webhookLimiter,
    registrationLimiter
};
