const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'investigating', 'resolved'], default: 'open' },
    resolutionNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
