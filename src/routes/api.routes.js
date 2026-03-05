const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Business = require('../models/Business');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const emailService = require('../services/email.service');
const { validateSpanishId } = require('../utils/idValidator');
const { authLimiter, registrationLimiter } = require('../middleware/rateLimiter');
const logger = require('../config/logger');
const env = require('../config/env');
const router = express.Router();

const SALT_ROUNDS = 10;

router.post('/business/register', registrationLimiter, async (req, res) => {
    try {
        const {
            name, phone, email, location, password,
            sector, entityType, businessGoal, taxId,
            ownerFullName, ownerDob, ownerIdNumber, ownerRole,
            country, dialCode
        } = req.body;

        const existing = await Business.findOne({ $or: [{ email }, { phone }] });
        if (existing) {
            return res.status(400).json({ error: 'Business already registered' });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Optional validation for demo
        if (taxId && !validateSpanishId(taxId)) {
            // We just log it for now to avoid blocking demo, but would normally return error
            console.warn("Invalid Tax ID provided:", taxId);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const business = await Business.create({
            name,
            phone,
            email,
            location,
            password: hashedPassword,
            sector,
            entityType,
            businessGoal,
            taxId,
            ownerFullName,
            ownerDob,
            ownerIdNumber,
            ownerRole,
            country: country || 'ES',
            dialCode: dialCode || '+34',
            services: [],
            availability: [],
            aiPersonality: 'professional',
            requiresPayment: false,
            city: location || 'Madrid',
            address: location || 'Not provided',
            currency: 'EUR',
            category: sector ? [sector] : ['other']
        });

        const token = jwt.sign({ businessId: business._id }, env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

        // Trigger Welcome Email
        try {
            await emailService.sendEmail({
                to: business.email,
                subject: `Welcome to ZAPI, ${business.name}!`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h1 style="color: #4F46E5;">Welcome to the ZAPI Family!</h1>
                        <p>Hello <strong>${ownerFullName || name}</strong>,</p>
                        <p>Your business is now registered. Our team will verify your identity documents within 24 hours.</p>
                        <p>In the meantime, you can start using your unique <strong>ZAPI ID</strong> for WhatsApp integration:</p>
                        <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 1.2rem; text-align: center; color: #111; border: 1px solid #E5E7EB;">
                            ${business._id}
                        </div>
                        <p>Paste this ID into chat with <strong>+1 970 575 5796</strong> to activate your agent.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
                        <p style="font-size: 0.9rem; color: #6B7280;">Best regards,<br/>The ZAPI Compliance Team</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error("Welcome email failed:", emailErr.message);
        }

        res.status(201).json({ business, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/business/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const business = await Business.findOne({ email });
        if (!business) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password with bcrypt
        const isValidPassword = await bcrypt.compare(password, business.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ businessId: business._id }, env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

        // Remove password from response
        const businessData = business.toObject();
        delete businessData.password;

        res.json({ token, business: businessData });
    } catch (error) {
        logger.error('Login error:', { error: error.message, email: req.body.email });
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/business/profile', authMiddleware, async (req, res) => {
    try {
        const business = await Business.findById(req.businessId).select('-password');
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }
        res.json(business);
    } catch (error) {
        logger.error('Error fetching business profile:', { error: error.message, businessId: req.businessId });
        res.status(500).json({ error: error.message });
    }
});

router.put('/business/profile', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Don't allow password updates through this endpoint
        const business = await Business.findByIdAndUpdate(req.businessId, updates, { new: true }).select('-password');
        logger.info('Business profile updated', { businessId: req.businessId });
        res.json(business);
    } catch (error) {
        logger.error('Error updating business profile:', { error: error.message, businessId: req.businessId });
        res.status(400).json({ error: error.message });
    }
});

// Bookings routes
router.get('/bookings', authMiddleware, async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        const query = { businessId: req.businessId };

        if (status) {
            query.status = status;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'phoneNumber language')
            .sort({ date: -1, startTime: -1 })
            .limit(100);

        res.json(bookings);
    } catch (error) {
        logger.error('Error fetching bookings:', { error: error.message, businessId: req.businessId });
        res.status(500).json({ error: error.message });
    }
});

router.get('/bookings/:id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            businessId: req.businessId
        }).populate('userId', 'phoneNumber language');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        logger.error('Error fetching booking:', { error: error.message, bookingId: req.params.id });
        res.status(500).json({ error: error.message });
    }
});

router.patch('/bookings/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, businessId: req.businessId },
            { status, updatedAt: new Date() },
            { new: true }
        ).populate('userId', 'phoneNumber language');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        logger.logBooking('status_updated', booking._id, { newStatus: status, businessId: req.businessId });
        res.json(booking);
    } catch (error) {
        logger.error('Error updating booking status:', { error: error.message, bookingId: req.params.id });
        res.status(500).json({ error: error.message });
    }
});

// Dashboard stats
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalBookings, todayBookings, pendingBookings, revenue] = await Promise.all([
            Booking.countDocuments({ businessId: req.businessId }),
            Booking.countDocuments({ businessId: req.businessId, date: { $gte: today } }),
            Booking.countDocuments({ businessId: req.businessId, status: 'pending' }),
            Booking.aggregate([
                { $match: { businessId: req.businessId, status: 'confirmed' } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ])
        ]);

        res.json({
            totalBookings,
            todayBookings,
            pendingBookings,
            revenue: revenue[0]?.total || 0
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats:', { error: error.message, businessId: req.businessId });
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
