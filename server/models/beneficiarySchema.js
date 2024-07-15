const mongoose = require("mongoose");

// Define Beneficiary Schema
const beneficiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Beneficiary model
const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);

module.exports = Beneficiary;
