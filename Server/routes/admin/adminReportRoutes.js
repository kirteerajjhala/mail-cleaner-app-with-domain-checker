const express = require('express');
const router = express.Router();
const { getReports, generateReport, getReport, deleteReport } = require('../../controllers/admin/adminReportController');

router.get('/', getReports);
router.post('/generate', generateReport);
router.get('/:id', getReport);
router.delete('/:id', deleteReport);

module.exports = router;
