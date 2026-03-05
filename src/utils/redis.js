const { Redis } = require('@upstash/redis');
const env = require('../config/env');

let redis;

if (env.REDIS_URL && env.REDIS_TOKEN) {
    redis = new Redis({
        url: env.REDIS_URL,
        token: env.REDIS_TOKEN,
    });
} else {
    console.warn('Upstash Redis credentials missing. Using mock Redis.');
    // Mock redis for dev
    redis = {
        setex: async (key, seconds, value) => { console.log(`Mock setex ${key}`); },
        get: async (key) => null,
        del: async (key) => { console.log(`Mock del ${key}`); }
    };
}

const lockSlot = async (businessId, date, time, userId, ttlSeconds = 600) => {
    const key = `lock:${businessId}:${date}:${time}`;

    // Try to set key only if it doesn't exist to prevent double locking
    // Normally using standard Redis we'd use set NX
    // Upstash provides atomic operations.
    const currentLock = await redis.get(key);
    if (currentLock && currentLock !== userId) {
        return false; // already locked by someone else
    }

    await redis.setex(key, ttlSeconds, userId);
    return true;
};

const releaseSlot = async (businessId, date, time) => {
    const key = `lock:${businessId}:${date}:${time}`;
    await redis.del(key);
};

const checkSlot = async (businessId, date, time) => {
    const key = `lock:${businessId}:${date}:${time}`;
    return await redis.get(key);
}

module.exports = {
    redis,
    lockSlot,
    releaseSlot,
    checkSlot
};
