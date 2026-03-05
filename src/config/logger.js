const winston = require('winston');
const path = require('path');

/**
 * Winston Logger Configuration
 * Provides structured logging with multiple transports
 */

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Define console format (more readable for development)
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Define which transports the logger should use
const transports = [
    // Console transport
    new winston.transports.Console({
        format: consoleFormat
    }),
    // Error log file
    new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        format
    }),
    // Combined log file
    new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
        format
    })
];

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    format,
    transports,
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join('logs', 'exceptions.log')
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join('logs', 'rejections.log')
        })
    ]
});

// Create a stream object for Morgan HTTP logger
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

// Helper methods for common logging patterns
logger.logRequest = (req, metadata = {}) => {
    logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        ...metadata
    });
};

logger.logWebhook = (provider, event, metadata = {}) => {
    logger.info('Webhook Received', {
        provider,
        event,
        ...metadata
    });
};

logger.logPayment = (action, bookingId, metadata = {}) => {
    logger.info('Payment Event', {
        action,
        bookingId,
        ...metadata
    });
};

logger.logBooking = (action, bookingId, metadata = {}) => {
    logger.info('Booking Event', {
        action,
        bookingId,
        ...metadata
    });
};

logger.logAuth = (action, identifier, success, metadata = {}) => {
    logger.info('Auth Event', {
        action,
        identifier,
        success,
        ...metadata
    });
};

module.exports = logger;
