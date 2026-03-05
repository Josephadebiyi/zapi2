require('dotenv').config();

const requiredEnvVars = [
    'PORT',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_WHATSAPP_NUMBER',
    'OPENAI_API_KEY',
    'MONGODB_URI',
    'REDIS_URL',
    'REDIS_TOKEN', // Upstash generally uses REST token or standard Redis URL
    'RESEND_API_KEY',
    'JWT_SECRET'
];

// Optional but recommended environment variables
const optionalEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'MONEI_API_KEY',
    'MONEI_WEBHOOK_SECRET'
];

const getEnv = () => {
    const env = {};
    const missing = [];

    // Process required environment variables
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            missing.push(key);
        } else {
            // Trim hidden spaces from Render environment variables to strictly prevent Auth crashes
            env[key] = typeof process.env[key] === 'string' ? process.env[key].trim() : process.env[key];
        }
    });

    // Process optional environment variables (no warnings if missing)
    optionalEnvVars.forEach((key) => {
        if (process.env[key]) {
            env[key] = typeof process.env[key] === 'string' ? process.env[key].trim() : process.env[key];
        }
    });

    if (missing.length > 0) {
        console.warn(`[WARNING] Missing required environment variables: ${missing.join(', ')}`);
    }

    return env;
};

module.exports = getEnv();
