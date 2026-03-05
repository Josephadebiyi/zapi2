const Stripe = require('stripe');
const axios = require('axios');
const crypto = require('crypto');
const env = require('../config/env');

let stripe;
if (env.STRIPE_SECRET_KEY) {
    stripe = Stripe(env.STRIPE_SECRET_KEY);
}

const createCheckoutSession = async (bookingId, amount, currency, businessStripeAccountId) => {
    if (!stripe) {
        console.warn("Stripe Secret Key missing. Returning mock session url.");
        return { url: "https://mock-stripe-checkout.com/session_123" };
    }

    try {
        const sessionConfig = {
            payment_method_types: ['card', 'bizum'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: 'ZAPI Appointment Booking',
                        },
                        unit_amount: amount * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://zapi.es/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://zapi.es/payment/cancel`,
            client_reference_id: bookingId.toString(),
            metadata: {
                bookingId: bookingId.toString()
            }
        };

        // If using Stripe Connect and paying the connected account directly
        if (businessStripeAccountId) {
            sessionConfig.payment_intent_data = {
                application_fee_amount: Math.round(amount * 100 * 0.1), // Example 10% fee
                transfer_data: {
                    destination: businessStripeAccountId,
                },
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);
        return session;
    } catch (error) {
        console.error('Stripe createCheckoutSession Error:', error);
        throw error;
    }
};

const verifyWebhookSignature = (rawBody, signature) => {
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return null;
    try {
        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
        return event;
    } catch (err) {
        console.error('Stripe webhook signature verification failed:', err.message);
        throw err;
    }
};

const createMoneiPayment = async (bookingId, amount, currency, businessName) => {
    if (!env.MONEI_API_KEY) {
        console.warn("MONEI API Key missing. Returning mock payment url.");
        return { url: "https://mock.monei.com/pay/123" };
    }

    try {
        const response = await axios.post('https://api.monei.com/v1/payments', {
            amount: Math.round(amount * 100),
            currency: currency,
            externalId: bookingId.toString(),
            callbackUrl: `https://${process.env.VERCEL_URL || 'zapi.es'}/webhook/monei`,
            successUrl: `https://zapi.es/payment/success`,
            cancelUrl: `https://zapi.es/payment/cancel`,
            description: `Booking at ${businessName}`
        }, {
            headers: {
                'Authorization': `Bearer ${env.MONEI_API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('MONEI createPayment Error:', error.response?.data || error.message);
        throw error;
    }
};

const verifyMoneiSignature = (body, signature, secret) => {
    if (!secret || !env.MONEI_WEBHOOK_SECRET) {
        console.warn('MONEI webhook secret not configured. Skipping signature verification.');
        return true; // In dev mode, allow through
    }

    try {
        // MONEI uses HMAC SHA-256 for webhook signature verification
        const webhookSecret = secret || env.MONEI_WEBHOOK_SECRET;
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(body))
            .digest('hex');

        // Constant-time comparison to prevent timing attacks
        const providedSignature = signature || '';
        if (expectedSignature.length !== providedSignature.length) {
            return false;
        }

        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(providedSignature)
        );
    } catch (error) {
        console.error('MONEI signature verification error:', error);
        return false;
    }
};

module.exports = {
    createCheckoutSession,
    verifyWebhookSignature,
    createMoneiPayment,
    verifyMoneiSignature
};
