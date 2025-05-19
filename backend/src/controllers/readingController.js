const Reading = require('../models/Reading');
const Device = require('../models/Device');

/**
 * Get readings for a device
 * @route GET /api/readings/:deviceId
 * @access Private
 */
const getDeviceReadings = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const { limit = 100, skip = 0, startDate, endDate } = req.query;
    
    // Find device to verify ownership
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this device data' });
    }
    
    // Build query
    const query = { deviceId };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Find readings
    const readings = await Reading.find(query)
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Reading.countDocuments(query);
    
    // Update device last active time
    device.lastActive = Date.now();
    await device.save();
    
    // Return readings
    res.json({
      total,
      count: readings.length,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
      readings: readings.map(reading => ({
        id: reading._id,
        deviceId: reading.deviceId,
        scale1: reading.scale1,
        scale2: reading.scale2,
        scale3: reading.scale3,
        scale4: reading.scale4,
        timestamp: reading.timestamp,
        totalWeight: reading.getTotalWeight()
      }))
    });
  } catch (error) {
    console.error('Get device readings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get latest reading for a device
 * @route GET /api/readings/:deviceId/latest
 * @access Private
 */
const getLatestReading = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    
    // Find device to verify ownership
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this device data' });
    }
    
    // Get latest reading
    const reading = await Reading.getLatestReading(deviceId);
    
    if (!reading) {
      return res.status(404).json({ message: 'No readings found for this device' });
    }
    
    // Update device last active time
    device.lastActive = Date.now();
    await device.save();
    
    // Return reading
    res.json({
      reading: {
        id: reading._id,
        deviceId: reading.deviceId,
        scale1: reading.scale1,
        scale2: reading.scale2,
        scale3: reading.scale3,
        scale4: reading.scale4,
        timestamp: reading.timestamp,
        totalWeight: reading.getTotalWeight()
      }
    });
  } catch (error) {
    console.error('Get latest reading error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get daily averages for a device
 * @route GET /api/readings/:deviceId/daily
 * @access Private
 */
const getDailyAverages = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const { startDate, endDate } = req.query;
    
    // Find device to verify ownership
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this device data' });
    }
    
    // Parse dates or use defaults (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    start.setDate(start.getDate() - 30);
    
    // Get daily averages
    const averages = await Reading.getDailyAverages(deviceId, start, end);
    
    // Return averages
    res.json({
      deviceId,
      startDate: start,
      endDate: end,
      count: averages.length,
      averages
    });
  } catch (error) {
    console.error('Get daily averages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete readings for a device
 * @route DELETE /api/readings/:deviceId
 * @access Private
 */
const deleteDeviceReadings = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const { startDate, endDate } = req.query;
    
    // Find device to verify ownership
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this device data' });
    }
    
    // Build query
    const query = { deviceId };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Delete readings
    const result = await Reading.deleteMany(query);
    
    // Return result
    res.json({
      message: `${result.deletedCount} readings deleted successfully`
    });
  } catch (error) {
    console.error('Delete device readings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDeviceReadings,
  getLatestReading,
  getDailyAverages,
  deleteDeviceReadings
};