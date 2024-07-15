const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAccountAdded: { type: Boolean, default: false },
  passwordCreatedAt: { type: Date, default: Date.now },
  passwordUpdatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
  profilePic: { type: String },
});

module.exports = mongoose.model("User", userSchema);
