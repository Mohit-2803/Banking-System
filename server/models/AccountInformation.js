const mongoose = require("mongoose");

const accountInformationSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountType: {
    type: String,
    required: true,
    enum: ["Savings", "Checking", "Credit"],
  },
  balance: { type: Number, required: true, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("AccountInformation", accountInformationSchema);
