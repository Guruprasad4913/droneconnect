const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientRole: {
    type: String,
    enum: ['operator', 'farmer', 'panchayat', 'admin'],
    default: 'operator'
  },
  type: {
    type: String,
    enum: ['new_booking', 'booking_accepted', 'cluster_formed', 'maintenance_alert', 'weather_alert'],
    default: 'new_booking'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cluster'
  },
  farmerName: {
    type: String,
    default: ''
  },
  village: {
    type: String,
    default: 'Rampur Kalan'
  },
  crop: {
    type: String,
    default: 'Paddy (Rice)'
  },
  acreage: {
    type: Number,
    default: 3.0
  },
  estimatedRevenue: {
    type: Number,
    default: 900
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  acceptedBy: {
    type: String,
    default: ''
  },
  acceptedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
