const express = require('express');
const router = express.Router();
const { detectSpam } = require('../controllers/spamController');
const { auth } = require('../middleware/auth');

router.post('/detect', auth, detectSpam);

module.exports = router;
