// Import Mongoose
const mongoose = require("mongoose");

// Define the Loan schema
const loanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loanType: {
    type: String,
    enum: ["personal", "home", "business"], // Example of loan types
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Example of loan status
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const Loan = mongoose.model("Loan", loanSchema);

// Export the model
module.exports = Loan;
