const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Middleware to authenticate JWT tokens
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with the id from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }
    
    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save();
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Middleware to check if user is admin
 */
const adminAuth = async (req, res, next) => {
  try {
    // First run the regular auth middleware
    await auth(req, res, async () => {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Admin authentication error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { auth, adminAuth };