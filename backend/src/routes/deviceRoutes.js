const express = require('express');
const { check } = require('express-validator');
const { 
  registerDevice, 
  getUserDevices, 
  getDeviceById, 
  updateDevice, 
  connectToDevice, 
  deleteDevice,
  getAllDevices 
} = require('../controllers/deviceController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/devices
 * @desc    Register a new device
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Device name is required').not().isEmpty(),
      check('numberOfScales', 'Number of scales must be between 1 and 4').optional().isInt({ min: 1, max: 4 })
    ]
  ],
  registerDevice
);

/**
 * @route   GET /api/devices
 * @desc    Get all devices for current user
 * @access  Private
 */
router.get('/', auth, getUserDevices);

/**
 * @route   GET /api/devices/:id
 * @desc    Get a specific device by ID
 * @access  Private
 */
router.get('/:id', auth, getDeviceById);

/**
 * @route   PUT /api/devices/:id
 * @desc    Update device settings
 * @access  Private
 */
router.put(
  '/:id',
  [
    auth,
    [
      check('name', 'Device name must not be empty if provided').optional().not().isEmpty(),
      check('scale1Limit', 'Scale 1 limit must be a number if provided').optional().isNumeric(),
      check('scale2Limit', 'Scale 2 limit must be a number if provided').optional().isNumeric(),
      check('scale3Limit', 'Scale 3 limit must be a number if provided').optional().isNumeric(),
      check('scale4Limit', 'Scale 4 limit must be a number if provided').optional().isNumeric(),
      check('status', 'Status must be active, inactive, or maintenance').optional().isIn(['active', 'inactive', 'maintenance'])
    ]
  ],
  updateDevice
);

/**
 * @route   POST /api/devices/connect
 * @desc    Connect to an existing device
 * @access  Private
 */
router.post(
  '/connect',
  [
    auth,
    [
      check('deviceId', 'Device ID is required').not().isEmpty(),
      check('ownerPassword', 'Owner password is required').not().isEmpty()
    ]
  ],
  connectToDevice
);

/**
 * @route   DELETE /api/devices/:id
 * @desc    Delete a device
 * @access  Private
 */
router.delete('/:id', auth, deleteDevice);

/**
 * @route   GET /api/admin/devices
 * @desc    Get all devices (admin only)
 * @access  Admin
 */
router.get('/admin/all', adminAuth, getAllDevices);

module.exports = router;