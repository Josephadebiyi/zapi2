const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  step: {
    type: String,
    required: true,
    enum: [
      'START',
      'AWAITING_QUERY',
      'AWAITING_LOCATION',
      'SHOWING_BUSINESSES',
      'SHOWING_SLOTS',
      'AWAITING_PAYMENT',
      'BOOKED'
    ],
    default: 'START'
  },
  data: {
    type: Object,
    default: {}
    // Contains: query, location, selectedBusiness, selectedSlot, bookingId, businesses[]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-update updatedAt on save
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// TTL index: auto-delete sessions older than 24 hours
sessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Session', sessionSchema);
