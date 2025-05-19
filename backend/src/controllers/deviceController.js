const Device = require('../models/Device');
const User = require('../models/User');
const Reading = require('../models/Reading');
const { validationResult } = require('express-validator');
const { client } = require('../config/mqtt');

/**
 * Register a new device
 * @route POST /api/devices
 * @access Private
 */
const registerDevice = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, numberOfScales, location, notes } = req.body;
  
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Generate device ID
    const deviceId = Device.generateDeviceId(userId, numberOfScales || 4);
    
    // Create new device
    const device = new Device({
      deviceId,
      name,
      userId,
      numberOfScales: numberOfScales || 4,
      location: location || '',
      notes: notes || ''
    });
    
    // Save device to database
    await device.save();
    
    // Subscribe to device-specific MQTT topic
    const deviceTopic = `weight-monitor/device/${deviceId}`;
    client.subscribe(deviceTopic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${deviceTopic}`);
      } else {
        console.error('Device subscription error:', err);
      }
    });
    
    // Return the new device
    res.status(201).json({
      message: 'Device registered successfully',
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        userId: device.userId,
        createdAt: device.createdAt,
        location: device.location,
        notes: device.notes
      }
    });
  } catch (error) {
    console.error('Device registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all devices for current user
 * @route GET /api/devices
 * @access Private
 */
const getUserDevices = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Find all devices for this user
    const devices = await Device.find({ userId });
    
    // Return the devices
    res.json({
      count: devices.length,
      devices: devices.map(device => ({
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        scale1Limit: device.scale1Limit,
        scale2Limit: device.scale2Limit,
        scale3Limit: device.scale3Limit,
        scale4Limit: device.scale4Limit,
        createdAt: device.createdAt,
        lastActive: device.lastActive,
        status: device.status,
        location: device.location,
        notes: device.notes
      }))
    });
  } catch (error) {
    console.error('Get user devices error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a specific device by ID
 * @route GET /api/devices/:id
 * @access Private
 */
const getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this device' });
    }
    
    // Get latest reading for this device
    const latestReading = await Reading.getLatestReading(deviceId);
    
    // Return the device with latest reading
    res.json({
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        scale1Limit: device.scale1Limit,
        scale2Limit: device.scale2Limit,
        scale3Limit: device.scale3Limit,
        scale4Limit: device.scale4Limit,
        createdAt: device.createdAt,
        lastActive: device.lastActive,
        status: device.status,
        location: device.location,
        notes: device.notes,
        deviceAge: device.deviceAge
      },
      latestReading: latestReading ? {
        scale1: latestReading.scale1,
        scale2: latestReading.scale2,
        scale3: latestReading.scale3,
        scale4: latestReading.scale4,
        timestamp: latestReading.timestamp,
        totalWeight: latestReading.getTotalWeight()
      } : null
    });
  } catch (error) {
    console.error('Get device by ID error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update device settings
 * @route PUT /api/devices/:id
 * @access Private
 */
const updateDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const { name, scale1Limit, scale2Limit, scale3Limit, scale4Limit, location, notes, status } = req.body;
    
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this device' });
    }
    
    // Update fields if provided
    if (name) device.name = name;
    if (scale1Limit !== undefined) device.scale1Limit = scale1Limit;
    if (scale2Limit !== undefined) device.scale2Limit = scale2Limit;
    if (scale3Limit !== undefined) device.scale3Limit = scale3Limit;
    if (scale4Limit !== undefined) device.scale4Limit = scale4Limit;
    if (location) device.location = location;
    if (notes) device.notes = notes;
    if (status) device.status = status;
    
    // Save updated device
    await device.save();
    
    // Notify device of updated limits if connected
    const configTopic = `weight-monitor/device/${deviceId}/config`;
    const configMessage = JSON.stringify({
      scale1Limit: device.scale1Limit,
      scale2Limit: device.scale2Limit,
      scale3Limit: device.scale3Limit,
      scale4Limit: device.scale4Limit,
      timestamp: Date.now()
    });
    
    client.publish(configTopic, configMessage, { qos: 1 });
    
    // Return updated device
    res.json({
      message: 'Device updated successfully',
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        scale1Limit: device.scale1Limit,
        scale2Limit: device.scale2Limit,
        scale3Limit: device.scale3Limit,
        scale4Limit: device.scale4Limit,
        createdAt: device.createdAt,
        lastActive: device.lastActive,
        status: device.status,
        location: device.location,
        notes: device.notes
      }
    });
  } catch (error) {
    console.error('Update device error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Connect to an existing device
 * @route POST /api/devices/connect
 * @access Private
 */
const connectToDevice = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { deviceId, ownerPassword } = req.body;
  
  try {
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Find device owner
    const owner = await User.findById(device.userId);
    
    if (!owner) {
      return res.status(404).json({ message: 'Device owner not found' });
    }
    
    // Verify owner password
    const isMatch = await owner.comparePassword(ownerPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid device owner password' });
    }
    
    // Return success response
    res.json({
      message: 'Successfully connected to device',
      device: {
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email
        },
        createdAt: device.createdAt
      }
    });
  } catch (error) {
    console.error('Connect to device error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a device
 * @route DELETE /api/devices/:id
 * @access Private
 */
const deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    
    // Find device
    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Check if device belongs to user or user is admin
    if (device.userId.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this device' });
    }
    
    // Delete device
    await Device.deleteOne({ deviceId });
    
    // Unsubscribe from device-specific MQTT topic
    const deviceTopic = `weight-monitor/device/${deviceId}`;
    client.unsubscribe(deviceTopic, (err) => {
      if (err) {
        console.error('Device unsubscribe error:', err);
      }
    });
    
    // Optionally, delete associated readings
    // await Reading.deleteMany({ deviceId });
    
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all devices (admin only)
 * @route GET /api/admin/devices
 * @access Admin
 */
const getAllDevices = async (req, res) => {
  try {
    // Find all devices with user information
    const devices = await Device.find().populate('userId', 'name email');
    
    // Return the devices
    res.json({
      count: devices.length,
      devices: devices.map(device => ({
        id: device._id,
        deviceId: device.deviceId,
        name: device.name,
        numberOfScales: device.numberOfScales,
        owner: {
          id: device.userId._id,
          name: device.userId.name,
          email: device.userId.email
        },
        createdAt: device.createdAt,
        lastActive: device.lastActive,
        status: device.status,
        location: device.location
      }))
    });
  } catch (error) {
    console.error('Get all devices error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerDevice,
  getUserDevices,
  getDeviceById,
  updateDevice,
  connectToDevice,
  deleteDevice,
  getAllDevices
};