const express = require('express');
const router = express.Router();
const { getSecurityLogs, getSecurityLog, clearLogs, getSecuritySummary } = require('../../controllers/admin/adminSecurityController');
const superAdminMiddleware = require('../../middleware/superAdminMiddleware');

router.get('/logs', getSecurityLogs);
router.get('/logs/:id', getSecurityLog);
router.get('/summary', getSecuritySummary);
router.delete('/logs/clear', superAdminMiddleware, clearLogs);

module.exports = router;
