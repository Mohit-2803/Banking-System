const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SentTransactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: "AccountInformation",
    required: true,
  },
  type: {
    type: String,
    enum: ["transfer", "payment"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
  description: {
    type: String,
  },
  recipientId: {
    type: String,
    required: true,
  },
  recipientAccountNumber: {
    type: String,
  },
  referenceNumber: {
    type: Number,
    required: true,
  },
  recipientAccount: {
    type: Schema.Types.ObjectId,
    ref: "AccountInformation",
    required: function () {
      return this.type === "transfer" || this.type === "payment";
    },
  },
});

const SentTransaction = mongoose.model(
  "SentTransaction",
  SentTransactionSchema
);

module.exports = SentTransaction;
