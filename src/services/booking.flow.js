const Business = require('../models/Business');
const Booking = require('../models/Booking');

// Simulates a complex MongoDB query for services/availability
const searchBusinesses = async (serviceQuery, locationQuery) => {
    let query = { isActive: true };

    if (serviceQuery) {
        query['services.name'] = { $regex: new RegExp(serviceQuery, 'i') };
    }

    if (locationQuery) {
        // Multi-field search for location: matches address, city, or name
        query.$or = [
            { location: { $regex: new RegExp(locationQuery, 'i') } },
            { name: { $regex: new RegExp(locationQuery, 'i') } }
        ];
    }

    // Limit to 5 results for WhatsApp readability
    return await Business.find(query).sort({ rating: -1 }).limit(5);
};

// Creates a pending booking in the database
const initializeBooking = async (userId, business, entities) => {
    // Find the exact service price logic would go here
    // Assuming the first matched service for demo
    const service = business.services.find(s => s.name.toLowerCase().includes(entities.service.toLowerCase())) || business.services[0];

    const price = service ? service.price : 50;
    const currency = service ? service.currency : 'EUR';

    const booking = await Booking.create({
        userId,
        businessId: business._id,
        serviceName: entities.service,
        date: new Date(entities.date),
        startTime: entities.time,
        endTime: entities.time, // Add duration calculation later
        price,
        currency,
        status: 'pending'
    });

    return booking;
};

// Get availability for a business on a specific date
const getAvailability = async (businessId, date) => {
    const business = await Business.findById(businessId);
    if (!business) return [];

    // Get existing bookings for that date
    const bookings = await Booking.find({
        businessId,
        date: new Date(date),
        status: { $in: ['pending', 'confirmed'] }
    });

    // Return available time slots (simple implementation)
    // In production, this would check business hours and booked slots
    const bookedTimes = bookings.map(b => b.startTime);
    const allSlots = business.availability || [];

    return allSlots.filter(slot => !bookedTimes.includes(slot));
};

// Get business Stripe details (for Stripe Connect)
const getBusinessStripeDetails = async (businessId) => {
    const business = await Business.findById(businessId);
    return {
        stripeAccountId: business?.stripeAccountId || null,
        requiresPayment: business?.requiresPayment || false
    };
};

// Cancel a booking
const cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({ _id: bookingId, userId });
        if (!booking) return false;

        // Only allow cancellation of pending or confirmed bookings
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return false;
        }

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        return true;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return false;
    }
};

// Confirms a booking, used primarily by the stripe webhook
const confirmBooking = async (bookingId, paymentIntentId) => {
    return await Booking.findByIdAndUpdate(bookingId, {
        status: 'confirmed',
        paymentIntentId
    }, { new: true });
};

module.exports = {
    searchBusinesses,
    getAvailability,
    initializeBooking,
    getBusinessStripeDetails,
    cancelBooking,
    confirmBooking
};
