const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'operator', 'panchayat', 'admin'],
    default: 'farmer'
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  organization: {
    type: String,
    default: 'Individual'
  },
  village: {
    type: String,
    default: 'Rampur Kalan'
  },
  district: {
    type: String,
    default: 'Lucknow'
  },
  state: {
    type: String,
    default: 'Uttar Pradesh'
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
