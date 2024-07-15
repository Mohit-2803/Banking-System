const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define notification schema
const NotificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

// Create model from schema
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
