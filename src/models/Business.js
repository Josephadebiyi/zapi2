const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  seetaId: {
    type: String,
    unique: true,
    sparse: true, // Allows null until KYC approved
    match: /^[0-9]{4}$/,
    index: true
  },
  category: {
    type: [String],
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  dialCode: {
    type: String,
    default: '+34'
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    enum: ['ES', 'NG', 'GB', 'US', 'FR', 'DE', 'IT', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
    default: 'ES',
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  services: [{
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    description: String,
    requiresPayment: { type: Boolean, default: false },
    _id: { type: String }
  }],
  location: {
    type: String,
    trim: true
  },
  sector: {
    type: String,
    enum: ['beauty', 'health', 'food', 'other', ''],
    default: ''
  },
  entityType: {
    type: String,
    enum: ['individual', 'company'],
    default: 'individual'
  },
  businessGoal: {
    type: String,
    enum: ['appointments', 'services', 'both'],
    default: 'both'
  },
  taxId: String,
  ownerFullName: String,
  ownerDob: Date,
  ownerIdNumber: String,
  ownerRole: String,
  aiPersonality: {
    type: String,
    enum: ['professional', 'friendly', 'concise', 'warm'],
    default: 'professional'
  },
  kycStatus: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  kycRejectionReason: {
    type: String,
    default: null
  },
  chargesForAppointments: {
    type: Boolean,
    default: false
  },
  appointmentFee: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    enum: ['NGN', 'EUR', 'GBP']
  },
  availableSlots: {
    type: [Date],
    default: []
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'stripe', null],
    default: null
  },
  paystackSubaccountCode: {
    type: String,
    default: null
  },
  stripeAccountId: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate 4-digit SEETA ID before saving
businessSchema.pre('save', async function(next) {
  if (!this.seetaId && this.isNew) {
    let unique = false;
    let seetaId;

    while (!unique) {
      // Generate random 4-digit number
      seetaId = Math.floor(1000 + Math.random() * 9000).toString();

      // Check if it already exists
      const existing = await mongoose.model('Business').findOne({ seetaId });
      if (!existing) {
        unique = true;
      }
    }

    this.seetaId = seetaId;
  }
  next();
});

// Compound index for search queries
businessSchema.index({ city: 1, category: 1, kycStatus: 1, active: 1 });

// Text index for fuzzy name/category search
businessSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Business', businessSchema);
