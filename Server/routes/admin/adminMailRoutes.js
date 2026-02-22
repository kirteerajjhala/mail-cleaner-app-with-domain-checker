const express = require('express');
const router = express.Router();
const { getMails, getMail, deleteMail, deleteBulkMails, getMailStats } = require('../../controllers/admin/adminMailController');
const superAdminMiddleware = require('../../middleware/superAdminMiddleware');

router.get('/', getMails);
router.get('/stats', getMailStats);
router.get('/:id', getMail);
router.delete('/:id', superAdminMiddleware, deleteMail);
router.delete('/bulk', superAdminMiddleware, deleteBulkMails);

module.exports = router;
