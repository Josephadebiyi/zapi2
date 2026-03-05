require('dotenv').config();

const requiredEnvVars = [
    'PORT',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_WHATSAPP_NUMBER',
    'OPENAI_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'MONGODB_URI',
    'REDIS_URL',
    'REDIS_TOKEN', // Upstash generally uses REST token or standard Redis URL
    'RESEND_API_KEY',
    'JWT_SECRET'
];

const getEnv = () => {
    const env = {};
    const missing = [];

    // We won't block startup on all missing vars during development, 
    // but it's good practice to know what's missing.
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            missing.push(key);
        }
        env[key] = process.env[key];
    });

    if (missing.length > 0) {
        console.warn(`[WARNING] Missing environment variables: ${missing.join(', ')}`);
    }

    return env;
};

module.exports = getEnv();
