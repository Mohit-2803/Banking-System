const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReceivedTransactionSchema = new Schema({
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
    enum: ["receive"],
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
  senderId: {
    type: String,
    required: true,
  },
  senderAccountNumber: {
    type: String,
    required: true,
  },
  referenceNumber: {
    type: Number,
    required: true,
  },
  senderAccount: {
    type: Schema.Types.ObjectId,
    ref: "AccountInformation",
    required: true,
  },
});

const ReceivedTransaction = mongoose.model(
  "ReceivedTransaction",
  ReceivedTransactionSchema
);

module.exports = ReceivedTransaction;
