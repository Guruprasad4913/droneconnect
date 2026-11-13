const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: {
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
  coordinates: {
    lat: { type: Number, default: 26.8520 },
    lng: { type: Number, default: 80.9510 }
  },
  totalAcreage: {
    type: Number,
    required: true,
    default: 3.5
  },
  primaryCrops: [{
    type: String
  }],
  soilType: {
    type: String,
    default: 'Alluvial Loam'
  },
  irrigationType: {
    type: String,
    default: 'Tube Well & Canal'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);
