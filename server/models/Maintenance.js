const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  droneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  droneName: {
    type: String,
    default: 'KisanDrone Hexacopter 10L'
  },
  dgcaUasId: {
    type: String,
    default: 'UA-7849-NDD'
  },
  overallHealthScore: {
    type: Number,
    default: 91
  },
  totalFlightHours: {
    type: Number,
    default: 142.5
  },
  lastFullServiceDate: {
    type: Date,
    default: () => new Date(Date.now() - 15 * 86400000)
  },
  nextServiceDueDate: {
    type: Date,
    default: () => new Date(Date.now() + 25 * 86400000)
  },
  components: [{
    key: String,
    name: String,
    healthScore: Number,
    status: { type: String, enum: ['nominal', 'warning', 'critical'] },
    flightHours: Number,
    notes: String
  }],
  alerts: [{
    id: String,
    component: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    message: String,
    actionRequired: String,
    createdAt: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
