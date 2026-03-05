const Queue = require('bull');
const logger = require('../config/logger');
const { confirmBooking } = require('./booking.flow');
const { sendMessage } = require('./whatsapp.service');
const redisUtils = require('../utils/redis');
const User = require('../models/User');
const env = require('../config/env');

/**
 * Job Queue Service for Retry Logic
 * Handles failed webhook processing with exponential backoff
 */

// Create queues with Redis connection (if available)
const createQueue = (name) => {
    if (env.REDIS_URL && env.REDIS_TOKEN) {
        // Parse Upstash Redis URL for Bull
        const redisUrl = new URL(env.REDIS_URL);
        return new Queue(name, {
            redis: {
                host: redisUrl.hostname,
                port: redisUrl.port || 6379,
                password: env.REDIS_TOKEN
            },
            defaultJobOptions: {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 2000 // 2s, 4s, 8s, 16s, 32s
                },
                removeOnComplete: 100, // Keep last 100 completed jobs
                removeOnFail: 500 // Keep last 500 failed jobs for debugging
            }
        });
    } else {
        logger.warn(`${name} queue: Redis not configured. Using mock queue.`);
        return {
            add: async (jobName, data) => {
                logger.info(`Mock queue: Would add job ${jobName}`, data);
                return { id: 'mock-job-' + Date.now() };
            },
            process: () => {
                logger.info(`Mock queue: Would process jobs for ${name}`);
            },
            on: () => {}
        };
    }
};

// Define queues
const paymentQueue = createQueue('payment-processing');
const notificationQueue = createQueue('notifications');

// Process payment confirmation jobs
paymentQueue.process('confirm-booking', async (job) => {
    const { bookingId, paymentIntentId, provider } = job.data;

    logger.info(`Processing payment confirmation job`, {
        jobId: job.id,
        bookingId,
        provider,
        attempt: job.attemptsMade + 1
    });

    try {
        const booking = await confirmBooking(bookingId, paymentIntentId);
        const bDate = booking.date.toISOString().split("T")[0];

        // Release slot lock
        await redisUtils.releaseSlot(booking.businessId, bDate, booking.startTime);

        logger.logBooking('confirmed', bookingId, { provider, paymentIntentId });

        // Queue notification
        await notificationQueue.add('send-booking-confirmation', {
            userId: booking.userId.toString(),
            bookingId: bookingId,
            date: bDate,
            time: booking.startTime,
            language: booking.language
        });

        return { success: true, bookingId };
    } catch (error) {
        logger.error(`Payment confirmation job failed`, {
            jobId: job.id,
            bookingId,
            error: error.message,
            attempt: job.attemptsMade + 1
        });
        throw error; // Re-throw to trigger retry
    }
});

// Process notification jobs
notificationQueue.process('send-booking-confirmation', async (job) => {
    const { userId, bookingId, date, time, language } = job.data;

    logger.info(`Processing notification job`, {
        jobId: job.id,
        userId,
        bookingId,
        attempt: job.attemptsMade + 1
    });

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(`User not found: ${userId}`);
        }

        const text = language === 'en'
            ? `Payment successful! Your booking is confirmed for ${date} at ${time}. Ref: ${bookingId}`
            : `¡Pago exitoso! Tu reserva está confirmada para el ${date} a las ${time}. Ref: ${bookingId}`;

        await sendMessage(user.phoneNumber, text);

        logger.info(`Booking confirmation sent`, {
            userId,
            bookingId,
            phoneNumber: user.phoneNumber
        });

        return { success: true, userId, bookingId };
    } catch (error) {
        logger.error(`Notification job failed`, {
            jobId: job.id,
            userId,
            bookingId,
            error: error.message,
            attempt: job.attemptsMade + 1
        });
        throw error;
    }
});

// Event listeners for payment queue
paymentQueue.on('completed', (job, result) => {
    logger.info(`Payment job completed`, {
        jobId: job.id,
        result
    });
});

paymentQueue.on('failed', (job, err) => {
    logger.error(`Payment job failed permanently`, {
        jobId: job.id,
        attempts: job.attemptsMade,
        error: err.message,
        data: job.data
    });
});

// Event listeners for notification queue
notificationQueue.on('completed', (job, result) => {
    logger.info(`Notification job completed`, {
        jobId: job.id,
        result
    });
});

notificationQueue.on('failed', (job, err) => {
    logger.error(`Notification job failed permanently`, {
        jobId: job.id,
        attempts: job.attemptsMade,
        error: err.message,
        data: job.data
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Closing queues...');
    // Only close if using real Bull queues (not mock)
    if (typeof paymentQueue.close === 'function') {
        await paymentQueue.close();
    }
    if (typeof notificationQueue.close === 'function') {
        await notificationQueue.close();
    }
});

module.exports = {
    paymentQueue,
    notificationQueue
};
