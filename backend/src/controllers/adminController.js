const User = require('../models/User');
const Device = require('../models/Device');
const Reading = require('../models/Reading');

/**
 * Get admin dashboard statistics
 * @route GET /api/admin/stats
 * @access Admin
 */
const getAdminStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total devices count
    const totalDevices = await Device.countDocuments();
    
    // Get active devices count
    const activeDevices = await Device.countDocuments({ status: 'active' });
    
    // Get total readings count
    const totalReadings = await Reading.countDocuments();
    
    // Get devices registered in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDevices = await Device.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get users registered in last 30 days
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.json({
      totalUsers,
      totalDevices,
      activeDevices,
      totalReadings,
      recentDevices,
      recentUsers,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get admin stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/admin/users
 * @access Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const { limit = 50, skip = 0, search = '' } = req.query;
    
    // Build search query
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    // Get users with device count
    const users = await User.aggregate([
      { $match: searchQuery },
      {
        $lookup: {
          from: 'devices',
          localField: '_id',
          foreignField: 'userId',
          as: 'devices'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          lastLogin: 1,
          deviceCount: { $size: '$devices' }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ]);
    
    // Get total count for pagination
    const total = await User.countDocuments(searchQuery);
    
    res.json({
      total,
      count: users.length,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit),
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        devices: user.deviceCount
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
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
        owner: device.userId ? {
          id: device.userId._id,
          name: device.userId.name,
          email: device.userId.email
        } : null,
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

/**
 * Update user role (admin only)
 * @route PUT /api/admin/users/:id/role
 * @access Admin
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete user (admin only)
 * @route DELETE /api/admin/users/:id
 * @access Admin
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Delete user's devices and readings
    await Device.deleteMany({ userId: id });
    await Reading.deleteMany({ userId: id });
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get system activity logs (admin only)
 * @route GET /api/admin/activity
 * @access Admin
 */
const getSystemActivity = async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    // Get recent device registrations
    const recentDevices = await Device.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);
    
    // Get recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);
    
    // Combine and format activity
    const activity = [];
    
    recentDevices.forEach(device => {
      activity.push({
        type: 'device_registered',
        message: `Device "${device.name}" registered by ${device.userId ? device.userId.name : 'Unknown'}`,
        timestamp: device.createdAt,
        user: device.userId ? device.userId.name : 'Unknown',
        details: {
          deviceId: device.deviceId,
          deviceName: device.name
        }
      });
    });
    
    recentUsers.forEach(user => {
      activity.push({
        type: 'user_registered',
        message: `New user "${user.name}" registered`,
        timestamp: user.createdAt,
        user: user.name,
        details: {
          email: user.email
        }
      });
    });
    
    // Sort by timestamp
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      count: activity.length,
      activity: activity.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Get system activity error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllDevices,
  updateUserRole,
  deleteUser,
  getSystemActivity
};