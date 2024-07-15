const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("VerificationCode", VerificationCodeSchema);
