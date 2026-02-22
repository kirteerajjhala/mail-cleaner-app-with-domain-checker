const express = require('express');
const router = express.Router();
const { getSettings, updateSetting, resetSettings } = require('../../controllers/admin/adminSettingsController');
const superAdminMiddleware = require('../../middleware/superAdminMiddleware');

router.get('/', getSettings);
router.put('/', updateSetting);
router.post('/reset', superAdminMiddleware, resetSettings);

module.exports = router;
