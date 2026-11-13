const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  droneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  droneUasId: {
    type: String,
    default: 'UA-7849-NDD'
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  capacityMah: {
    type: Number,
    default: 16000
  },
  voltage: {
    type: Number,
    default: 49.8
  },
  chargePct: {
    type: Number,
    default: 96
  },
  healthPct: {
    type: Number,
    default: 94
  },
  cycleCount: {
    type: Number,
    default: 112
  },
  status: {
    type: String,
    enum: ['ready', 'in-use', 'charging', 'depleted', 'maintenance-needed'],
    default: 'ready'
  },
  temperatureC: {
    type: Number,
    default: 28.5
  },
  estimatedFlightTimeMins: {
    type: Number,
    default: 22
  },
  lastChargedAt: {
    type: Date,
    default: Date.now
  },
  chargingLocation: {
    type: String,
    enum: ['hub-depot', 'mobile-solar-van', 'field-generator'],
    default: 'mobile-solar-van'
  },
  chargingRecommendation: {
    type: String,
    default: 'Cell voltages balanced (4.15V/cell). Ready for dispatch in Cluster mission.'
  },
  cellVoltages: [{
    type: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Battery', batterySchema);
