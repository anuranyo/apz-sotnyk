const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemActivity
} = require('../controllers/adminController');
const { getAllDevices } = require('../controllers/deviceController'); // Добавить импорт
const { adminAuth } = require('../middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin
 */
router.get('/stats', adminAuth, getAdminStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and search
 * @access  Admin
 */
router.get('/users', adminAuth, getAllUsers);

/**
 * @route   GET /api/admin/devices
 * @desc    Get all devices (admin only)
 * @access  Admin
 */
router.get('/devices', adminAuth, getAllDevices);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin
 */
router.put(
  '/users/:id/role',
  [
    adminAuth,
    [
      check('role', 'Role must be "user" or "admin"').isIn(['user', 'admin'])
    ]
  ],
  updateUserRole
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user and associated data
 * @access  Admin
 */
router.delete('/users/:id', adminAuth, deleteUser);

/**
 * @route   GET /api/admin/activity
 * @desc    Get system activity logs
 * @access  Admin
 */
router.get('/activity', adminAuth, getSystemActivity);

module.exports = router;