const { redis } = require('../utils/redis');

/**
 * Session State Management Service
 * Tracks conversation context for WhatsApp users across multiple messages
 */

const SESSION_TTL = 1800; // 30 minutes

/**
 * Get session data for a user
 * @param {string} phoneNumber - User's phone number
 * @returns {Object|null} Session data or null if not exists
 */
const getSession = async (phoneNumber) => {
    const key = `session:${phoneNumber}`;
    const data = await redis.get(key);

    if (!data) return null;

    try {
        return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        console.error('Error parsing session data:', e);
        return null;
    }
};

/**
 * Save session data for a user
 * @param {string} phoneNumber - User's phone number
 * @param {Object} sessionData - Session data to store
 */
const saveSession = async (phoneNumber, sessionData) => {
    const key = `session:${phoneNumber}`;
    const value = JSON.stringify(sessionData);
    await redis.setex(key, SESSION_TTL, value);
};

/**
 * Update specific fields in session
 * @param {string} phoneNumber - User's phone number
 * @param {Object} updates - Fields to update
 */
const updateSession = async (phoneNumber, updates) => {
    const session = await getSession(phoneNumber) || {};
    const updatedSession = { ...session, ...updates, lastActivity: new Date().toISOString() };
    await saveSession(phoneNumber, updatedSession);
    return updatedSession;
};

/**
 * Clear session for a user
 * @param {string} phoneNumber - User's phone number
 */
const clearSession = async (phoneNumber) => {
    const key = `session:${phoneNumber}`;
    await redis.del(key);
};

/**
 * Initialize a new session with conversation state
 * @param {string} phoneNumber - User's phone number
 * @param {Object} initialData - Initial session data
 */
const initSession = async (phoneNumber, initialData = {}) => {
    const sessionData = {
        phoneNumber,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        conversationState: 'idle', // idle, searching, selecting_business, booking, confirming
        selectedBusiness: null,
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        searchResults: [],
        pendingBookingId: null,
        language: 'es',
        ...initialData
    };

    await saveSession(phoneNumber, sessionData);
    return sessionData;
};

/**
 * Store search results in session
 * @param {string} phoneNumber - User's phone number
 * @param {Array} businesses - Array of business objects
 */
const setSearchResults = async (phoneNumber, businesses) => {
    return await updateSession(phoneNumber, {
        searchResults: businesses.map(b => ({
            id: b._id.toString(),
            name: b.name,
            location: b.location,
            services: b.services
        })),
        conversationState: 'selecting_business'
    });
};

/**
 * Get selected business from session
 * @param {string} phoneNumber - User's phone number
 * @returns {Object|null} Business object or null
 */
const getSelectedBusiness = async (phoneNumber) => {
    const session = await getSession(phoneNumber);
    return session?.selectedBusiness || null;
};

/**
 * Set selected business in session
 * @param {string} phoneNumber - User's phone number
 * @param {Object} business - Business object
 */
const setSelectedBusiness = async (phoneNumber, business) => {
    return await updateSession(phoneNumber, {
        selectedBusiness: {
            id: business._id.toString(),
            name: business.name,
            location: business.location,
            services: business.services,
            requiresPayment: business.requiresPayment
        },
        conversationState: 'booking'
    });
};

/**
 * Update booking details in session
 * @param {string} phoneNumber - User's phone number
 * @param {Object} bookingDetails - Date, time, service
 */
const updateBookingDetails = async (phoneNumber, bookingDetails) => {
    return await updateSession(phoneNumber, {
        ...bookingDetails,
        conversationState: 'confirming'
    });
};

module.exports = {
    getSession,
    saveSession,
    updateSession,
    clearSession,
    initSession,
    setSearchResults,
    getSelectedBusiness,
    setSelectedBusiness,
    updateBookingDetails
};
