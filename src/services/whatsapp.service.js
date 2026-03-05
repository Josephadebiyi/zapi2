const twilio = require('twilio');
const env = require('../config/env');

let twilioClient;

if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
} else {
    console.warn("Twilio credentials missing. WhatsApp service will only log messages.");
}

const sendMessage = async (to, body) => {
    if (!twilioClient) {
        console.log(`[MOCK WHATSAPP to ${to}]: ${body}`);
        return;
    }

    try {
        // Ensure 'to' is a valid string
        if (!to || typeof to !== 'string') {
            throw new Error(`Recipient number is invalid: ${to}`);
        }

        const toNumber = to.trim();
        if (!toNumber || toNumber === 'undefined' || toNumber === 'null') {
            throw new Error("Recipient number is missing or invalid");
        }

        // Ensure body is valid
        if (!body || typeof body !== 'string') {
            throw new Error("Message body is missing or invalid");
        }

        const message = await twilioClient.messages.create({
            body: body,
            from: `whatsapp:${env.TWILIO_WHATSAPP_NUMBER}`,
            to: toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`
        });
        console.log(`Message sent: ${message.sid}`);
        return message;
    } catch (error) {
        console.error("Twilio sendMessage Error:", error);
        throw error;
    }
};

const validateSignature = (signature, url, params) => {
    if (!env.TWILIO_AUTH_TOKEN) return true; // skip validation in dev if no token
    return twilio.validateRequest(env.TWILIO_AUTH_TOKEN, signature, url, params);
};

module.exports = {
    sendMessage,
    validateSignature
};
