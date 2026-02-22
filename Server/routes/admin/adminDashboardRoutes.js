const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCharts } = require('../../controllers/admin/adminDashboardController');

router.get('/stats', getDashboardStats);
router.get('/charts', getDashboardCharts);

module.exports = router;
