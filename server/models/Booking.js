const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  farmerName: {
    type: String,
    required: true
  },
  farmName: {
    type: String,
    default: 'Green Valley Plot'
  },
  village: {
    type: String,
    required: true
  },
  district: {
    type: String,
    default: 'Lucknow'
  },
  state: {
    type: String,
    default: 'Uttar Pradesh'
  },
  zone: {
    type: String,
    default: 'Zone North'
  },
  crop: {
    type: String,
    required: true,
    default: 'Paddy (Rice)'
  },
  acreage: {
    type: Number,
    required: true,
    min: 0.5
  },
  serviceRequired: {
    type: String,
    required: true,
    enum: [
      'nano-urea-spray',
      'bio-fungicide',
      'micronutrient-tonic',
      'pest-defense',
      'crop-health-ndvi',
      'cadastral-mapping'
    ],
    default: 'nano-urea-spray'
  },
  chemicalType: {
    type: String,
    default: 'IFFCO Nano Urea & DAP'
  },
  preferredDate: {
    type: Date,
    default: () => new Date(Date.now() + 86400000) // tomorrow
  },
  status: {
    type: String,
    enum: ['pending', 'clustered', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cluster'
  },
  coordinates: {
    lat: { type: Number, default: 26.8520 },
    lng: { type: Number, default: 80.9510 }
  },
  pricing: {
    soloRate: { type: Number, default: 400 },
    clusteredRate: { type: Number, default: 300 },
    actualRateApplied: { type: Number, default: 400 },
    totalCost: { type: Number, default: 1200 },
    savingsAmount: { type: Number, default: 0 }
  },
  notes: {
    type: String,
    default: ''
  },
  invoiceNumber: {
    type: String,
    default: ''
  },
  bookedByRole: {
    type: String,
    enum: ['farmer', 'panchayat'],
    default: 'farmer'
  },
  assistedByPanchayat: {
    type: Boolean,
    default: false
  },
  panchayatKioskName: {
    type: String,
    default: ''
  },
  farmerPhone: {
    type: String,
    default: ''
  },
  aadhaarLast4: {
    type: String,
    default: ''
  },
  khasraNumber: {
    type: String,
    default: ''
  },
  cashPaymentCollected: {
    type: Boolean,
    default: false
  },
  paperTokenSlip: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
