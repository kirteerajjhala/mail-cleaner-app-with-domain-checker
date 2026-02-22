const express = require("express");
const router = express.Router();
const emailController = require("../controller/email-record-controller");
const { protect } = require("../../middleware/authMiddleware");

// Save email
router.post("/save", protect,  emailController.saveEmailRecord);

// Get all emails
router.get("/all", emailController.getAllEmailRecords);
router.delete('/delete/:id',emailController.deleteEmailRecordById);

module.exports = router;