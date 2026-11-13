const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Cluster ZN-Alpha: 12-Acre Pooled Hub'
  },
  hubCode: {
    type: String,
    required: true,
    default: 'HUB-ZN-101'
  },
  zone: {
    type: String,
    required: true,
    default: 'Zone North'
  },
  targetDate: {
    type: Date,
    default: () => new Date(Date.now() + 86400000)
  },
  status: {
    type: String,
    enum: ['forming', 'optimized', 'accepted', 'dispatched', 'in-mission', 'completed'],
    default: 'optimized'
  },
  bookings: [{
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    farmerName: String,
    village: String,
    acreage: Number,
    crop: String,
    lat: Number,
    lng: Number
  }],
  farmerCount: {
    type: Number,
    default: 4
  },
  totalAcreage: {
    type: Number,
    default: 12.0
  },
  centerCoordinates: {
    lat: { type: Number, default: 26.8467 },
    lng: { type: Number, default: 80.9462 }
  },
  waypoints: [{
    id: String,
    name: String,
    type: { type: String, enum: ['base', 'farm', 'charging-stop'] },
    lat: Number,
    lng: Number,
    acres: Number,
    cumulativeKm: Number
  }],
  optimizedRoute: {
    sequence: [String],
    totalDistanceKm: { type: Number, default: 14.2 },
    individualDistanceKm: { type: Number, default: 38.6 },
    travelSavingsKm: { type: Number, default: 24.4 },
    fuelSavedLiters: { type: Number, default: 5.8 },
    estimatedFlightTimeMin: { type: Number, default: 68 }
  },
  batteryRequirements: {
    packsNeeded: { type: Number, default: 2 },
    swapStopsCount: { type: Number, default: 1 },
    estimatedDischargePct: { type: Number, default: 78 }
  },
  pricing: {
    soloRateTotal: { type: Number, default: 4800 },
    clusteredRateTotal: { type: Number, default: 3600 },
    farmerSavingsTotal: { type: Number, default: 1200 },
    operatorRevenue: { type: Number, default: 3600 },
    operatorCost: { type: Number, default: 650 },
    estimatedProfit: { type: Number, default: 2950 }
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  operatorName: {
    type: String,
    default: 'Prerna Drone Didi SHG'
  },
  droneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  droneUasId: {
    type: String,
    default: 'UA-7849-NDD'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cluster', clusterSchema);
