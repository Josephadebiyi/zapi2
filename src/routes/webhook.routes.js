const express = require('express');
const router = express.Router();
const { extractIntent } = require('../services/ai.service');
const { handleIntent } = require('../services/intent.controller');
const { sendMessage, validateSignature } = require('../services/whatsapp.service');
const { verifyWebhookSignature, verifyMoneiSignature } = require('../services/payment.service');
const { paymentQueue } = require('../services/queue.service');
const logger = require('../config/logger');
const Business = require('../models/Business');

const twilioWebhook = async (req, res) => {
    res.status(200).send('<Response></Response>');

    const signature = req.headers['x-twilio-signature'];

    // Explicitly force HTTPS for the full URL since we know we are behind a secure proxy (Render)
    // If req.protocol is 'http' but we are actually on HTTPS, the signature validation will fail
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const fullUrl = `https://${host}${req.originalUrl}`; // Force HTTPS for Twilio signature calc

    if (!validateSignature(signature, fullUrl, req.body)) {
        logger.error("Invalid Twilio signature", { fullUrl });
        return;
    }

    const userMessage = req.body.Body;
    const fromNumber = req.body.From;

    logger.logWebhook('twilio', 'message', { from: fromNumber, message: userMessage });

    try {
        const seetaIdMatch = userMessage.match(/[0-9a-fA-F]{24}/);
        let personality = 'professional';

        if (seetaIdMatch) {
            const biz = await Business.findById(seetaIdMatch[0]);
            if (biz) personality = biz.aiPersonality;
        }

        const extractedData = await extractIntent(userMessage, personality);

        // Safety check: ensure extractedData is valid
        if (!extractedData || !extractedData.intent) {
            logger.warn("Invalid extracted data from AI:", { from: fromNumber, extractedData });
            // Detect very basic language from intent fallback
            const msgError = (extractedData && extractedData.language === 'en')
                ? "I'm sorry, I couldn't understand your message. Could you try again?"
                : "Lo siento, no pude entender tu mensaje. ¿Puedes intentar de nuevo?";
            await sendMessage(fromNumber, msgError);
            return;
        }

        const replyMessage = await handleIntent(fromNumber, extractedData);

        if (replyMessage) {
            await sendMessage(fromNumber, replyMessage);
        }
    } catch (error) {
        logger.error("Error in Twilio webhook:", { error: error.message, stack: error.stack, from: fromNumber });
        // Assuming user is spanish by default if error gets caught before extraction but could be smarter
        await sendMessage(fromNumber, "Lo siento, estamos experimentando problemas técnicos.");
    }
};

const stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = verifyWebhookSignature(req.body, signature);
    } catch (err) {
        logger.error('Stripe webhook signature verification failed', { error: err.message });
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event && event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.client_reference_id;

        logger.logWebhook('stripe', 'checkout.session.completed', {
            bookingId,
            sessionId: session.id,
            paymentIntent: session.payment_intent
        });

        try {
            // Queue the payment confirmation job with retry logic
            await paymentQueue.add('confirm-booking', {
                bookingId,
                paymentIntentId: session.payment_intent,
                provider: 'stripe',
                sessionId: session.id
            });

            logger.info('Payment confirmation job queued', { bookingId, provider: 'stripe' });
        } catch (err) {
            logger.error("Error queueing payment confirmation:", {
                error: err.message,
                bookingId,
                provider: 'stripe'
            });
        }
    }

    res.status(200).json({ received: true });
};

const moneiWebhook = async (req, res) => {
    const signature = req.headers['monei-signature'];

    if (!verifyMoneiSignature(req.body, signature)) {
        logger.error('Monei webhook signature verification failed');
        return res.status(401).send("Invalid signature");
    }

    const { status, externalId, id: moneiId } = req.body;

    logger.logWebhook('monei', status, {
        bookingId: externalId,
        moneiId
    });

    if (status === 'SUCCEEDED') {
        try {
            // Queue the payment confirmation job with retry logic
            await paymentQueue.add('confirm-booking', {
                bookingId: externalId,
                paymentIntentId: moneiId,
                provider: 'monei'
            });

            logger.info('Payment confirmation job queued', { bookingId: externalId, provider: 'monei' });
        } catch (err) {
            logger.error("Error queueing payment confirmation:", {
                error: err.message,
                bookingId: externalId,
                provider: 'monei'
            });
        }
    }

    res.status(200).json({ received: true });
};

module.exports = { twilioWebhook, stripeWebhook, moneiWebhook };
