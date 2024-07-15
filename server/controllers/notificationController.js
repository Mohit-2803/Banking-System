// controllers/notificationController.js
const Notification = require("../models/notificationSchema");
const User = require("../models/User");

// Get all notifications
exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({
      timestamp: -1,
    });
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Send a notification
exports.sendNotification = async (req, res) => {
  const { userId, title, message } = req.body;

  try {
    const user = await User.findOne({ userId });

    const newNotification = new Notification({
      userId,
      user: user._id,
      title,
      message,
    });

    await newNotification.save();
    res.status(201).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

// Update notification as read
exports.updateNotificationRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, {
      read: true,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification updated as read", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};
