const express = require('express');
const router = express.Router();
const { getSpamLogs, getSpamLog, deleteSpamLog, flagSpamLog, clearSpamLog, getSpamAnalytics } = require('../../controllers/admin/adminSpamController');

router.get('/', getSpamLogs);
router.get('/analytics', getSpamAnalytics);
router.get('/:id', getSpamLog);
router.delete('/:id', deleteSpamLog);
router.put('/:id/flag', flagSpamLog);
router.put('/:id/clear', clearSpamLog);

module.exports = router;
