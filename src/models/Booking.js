const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    match: /^ZBK-[A-Z0-9]{8}$/,
    index: true
  },
  userPhone: {
    type: String,
    required: true,
    index: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  slotTime: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending_payment', 'confirmed', 'cancelled'],
    default: 'pending_payment',
    index: true
  },
  chargedForAppointment: {
    type: Boolean,
    required: true,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'stripe', null],
    default: null
  },
  paymentReference: {
    type: String,
    default: null,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for business query
bookingSchema.index({ businessId: 1, status: 1, slotTime: 1 });

// Prevent double-booking same slot
bookingSchema.index(
  { businessId: 1, slotTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
