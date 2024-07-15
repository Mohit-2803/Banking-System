const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getNotifications,
  updateNotificationRead,
} = require("../controllers/notificationController");

router.post("/sendNotification", sendNotification);
router.post("/updateNotificationRead/:notificationId", updateNotificationRead);
router.get("/getNotifications/:userId", getNotifications);

module.exports = router;
