const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  scale1: {
    type: Number,
    default: 0
  },
  scale2: {
    type: Number,
    default: 0
  },
  scale3: {
    type: Number,
    default: 0
  },
  scale4: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create compound index for efficient querying
ReadingSchema.index({ deviceId: 1, timestamp: -1 });
ReadingSchema.index({ userId: 1, timestamp: -1 });

// Add a method to get total weight
ReadingSchema.methods.getTotalWeight = function() {
  return this.scale1 + this.scale2 + this.scale3 + this.scale4;
};

// Static method to get readings for a specific time period
ReadingSchema.statics.getReadingsForPeriod = async function(deviceId, startDate, endDate) {
  return this.find({
    deviceId,
    timestamp: {
      $gte: startDate,
      $lte: endDate || new Date()
    }
  }).sort({ timestamp: 1 });
};

// Static method to get latest reading for a device
ReadingSchema.statics.getLatestReading = async function(deviceId) {
  return this.findOne({ deviceId }).sort({ timestamp: -1 });
};

// Static method to get daily averages
ReadingSchema.statics.getDailyAverages = async function(deviceId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        deviceId,
        timestamp: {
          $gte: startDate,
          $lte: endDate || new Date()
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" }
        },
        avgScale1: { $avg: "$scale1" },
        avgScale2: { $avg: "$scale2" },
        avgScale3: { $avg: "$scale3" },
        avgScale4: { $avg: "$scale4" },
        count: { $sum: 1 },
        date: { $first: "$timestamp" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date"
          }
        },
        avgScale1: { $round: ["$avgScale1", 2] },
        avgScale2: { $round: ["$avgScale2", 2] },
        avgScale3: { $round: ["$avgScale3", 2] },
        avgScale4: { $round: ["$avgScale4", 2] },
        totalAvg: {
          $round: [{
            $add: ["$avgScale1", "$avgScale2", "$avgScale3", "$avgScale4"]
          }, 2]
        },
        readingCount: "$count"
      }
    }
  ]);
};

module.exports = mongoose.model('Reading', ReadingSchema);