const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');

const { auth } = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot password - send token by email
router.post('/forgot', forgotPassword);

// Reset password - with token in URL
router.post('/reset/:token', resetPassword);

// Optional: get current user
router.get('/me', auth, getMe);

module.exports = router;
