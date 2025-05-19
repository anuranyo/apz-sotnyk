const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numberOfScales: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 4
  },
  scale1Limit: {
    type: Number,
    default: null
  },
  scale2Limit: {
    type: Number,
    default: null
  },
  scale3Limit: {
    type: Number,
    default: null
  },
  scale4Limit: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
});

// Generate device ID based on date, number of scales, and user ID
DeviceSchema.statics.generateDeviceId = function(userId, numberOfScales) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}_${numberOfScales}_${userId}`;
};

// Virtual for device age
DeviceSchema.virtual('deviceAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Device', DeviceSchema);