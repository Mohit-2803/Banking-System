const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  updateContactMessageStatus,
  getAllContactMessages,
  getContactMessageById,
} = require("../controllers/contactUsController");

router.post("/createContactMessage", createContactMessage);
router.post("/updateContactMessageStatus", updateContactMessageStatus);
router.get("/getAllContactMessages", getAllContactMessages);
router.get("/getContactMessageById", getContactMessageById);

module.exports = router;
