const express = require('express');
const router = express.Router();
const { analyzeOutgoingMail } = require('../controllers/outgoingMailController');
const { auth } = require('../middleware/auth');

router.post('/analyze', auth, analyzeOutgoingMail);

module.exports = router;
