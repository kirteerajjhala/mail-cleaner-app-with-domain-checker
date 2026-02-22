const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUserRole, blockUser, unblockUser, deleteUser, updateAdminNotes } = require('../../controllers/admin/adminUserController');
const superAdminMiddleware = require('../../middleware/superAdminMiddleware');

// Get all users
router.get('/', getUsers);
router.get('/:id', getUser);

// Admin actions
router.put('/:id/block', blockUser);
router.put('/:id/unblock', unblockUser);
router.put('/:id/notes', updateAdminNotes);

// SuperAdmin only
router.put('/:id/role', superAdminMiddleware, updateUserRole);
router.delete('/:id', superAdminMiddleware, deleteUser);

module.exports = router;
