const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../../controllers/admin/adminAuthController');
const adminMiddleware = require('../../middleware/adminMiddleware');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});

router.post('/login', loginLimiter, login);
router.post('/logout', adminMiddleware, logout);
router.get('/me', adminMiddleware, getMe);

module.exports = router;
