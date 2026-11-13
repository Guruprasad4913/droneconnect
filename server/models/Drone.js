const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    default: 'KisanDrone Hexacopter 10L'
  },
  dgcaUasId: {
    type: String,
    required: true,
    unique: true,
    default: 'UA-7849-NDD'
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  operatorName: {
    type: String,
    default: 'Prerna Drone Didi SHG'
  },
  payloadCapacityLiters: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['available', 'in-mission', 'maintenance', 'charging'],
    default: 'available'
  },
  totalFlightHours: {
    type: Number,
    default: 142.5
  },
  completedAcres: {
    type: Number,
    default: 890
  },
  batteryCount: {
    type: Number,
    default: 4
  },
  sprayWidthMeters: {
    type: Number,
    default: 4.5
  },
  baseLocation: {
    hubName: { type: String, default: 'Zone North Main Hub' },
    village: { type: String, default: 'Rampur Kalan' },
    lat: { type: Number, default: 26.8467 },
    lng: { type: Number, default: 80.9462 }
  },
  specs: {
    maxSpeedMs: { type: Number, default: 8.5 },
    flowRateLMin: { type: Number, default: 3.2 },
    nozzleType: { type: String, default: 'Centrifugal Micron Atomizers (4x)' },
    batteryType: { type: String, default: 'Smart 12S 16,000mAh LiPo' }
  },
  lastInspectionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drone', droneSchema);
