const express = require('express');
const { 
  getDeviceReadings, 
  getLatestReading, 
  getDailyAverages, 
  deleteDeviceReadings 
} = require('../controllers/readingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/readings/:deviceId
 * @desc    Get readings for a device
 * @access  Private
 */
router.get('/:deviceId', auth, getDeviceReadings);

/**
 * @route   GET /api/readings/:deviceId/latest
 * @desc    Get latest reading for a device
 * @access  Private
 */
router.get('/:deviceId/latest', auth, getLatestReading);

/**
 * @route   GET /api/readings/:deviceId/daily
 * @desc    Get daily averages for a device
 * @access  Private
 */
router.get('/:deviceId/daily', auth, getDailyAverages);

/**
 * @route   DELETE /api/readings/:deviceId
 * @desc    Delete readings for a device
 * @access  Private
 */
router.delete('/:deviceId', auth, deleteDeviceReadings);

module.exports = router;