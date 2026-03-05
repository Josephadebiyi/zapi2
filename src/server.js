const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const { apiLimiter, webhookLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect to MongoDB
connectDB();

logger.info('Starting ZAPI server...');

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for React app in production
}));
app.use(cors());

// Handle Stripe Webhook carefully because it needs the raw body
app.use('/webhook/stripe', webhookLimiter, express.raw({ type: 'application/json' }), require('./routes/webhook.routes').stripeWebhook);

// For other routes, parse JSON and URL encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// Routes with rate limiting
app.use('/webhook/twilio', webhookLimiter, require('./routes/webhook.routes').twilioWebhook);
app.use('/webhook/monei', webhookLimiter, require('./routes/webhook.routes').moneiWebhook);
app.use('/api', apiLimiter, require('./routes/api.routes'));

// Serve static files from public directory (production)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Basic healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date() });
});

// SPA fallback - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
    // Don't serve index.html for API/webhook routes
    if (req.path.startsWith('/api') || req.path.startsWith('/webhook') || req.path === '/health') {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            logger.warn('Frontend build not found. Run: cd frontend && npm run build');
            res.status(404).send('Frontend not built. Run: cd frontend && npm run build');
        }
    });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        code: err.code
    });
    res.status(500).json({ error: 'Server error' });
});

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`ZAPI server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
