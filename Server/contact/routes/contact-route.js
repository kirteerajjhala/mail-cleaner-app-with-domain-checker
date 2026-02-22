// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact-controller.js");

// POST /contact -> create a new contact
router.post("/", contactController.createContact);
router.get("/getAllContact", contactController.getAllContacts);
router.post("/reply/:id", contactController.replyContact);

router.delete("/deleteContact/:id", contactController.deleteContact);
module.exports = router;
