const express = require('express');
const router = express.Router();
const { getContacts, getContact, updateStatus, assignContact, replyContact, deleteContact } = require('../../controllers/admin/adminContactController');
const superAdminMiddleware = require('../../middleware/superAdminMiddleware');

router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id/status', updateStatus);
router.put('/:id/assign', assignContact);
router.put('/:id/reply', replyContact);
router.delete('/:id', superAdminMiddleware, deleteContact);

module.exports = router;
