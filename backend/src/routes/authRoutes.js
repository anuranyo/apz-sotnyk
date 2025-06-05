const express = require('express');
const { check } = require('express-validator');
const { register, login, logout, getProfile, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    auth,
    [
      check('name', 'Name is required if provided').optional().not().isEmpty(),
      check('email', 'Please include a valid email if provided').optional().isEmail(),
      check('password', 'Password must be at least 6 characters if provided').optional().isLength({ min: 6 })
    ]
  ],
  updateProfile
);

module.exports = router;