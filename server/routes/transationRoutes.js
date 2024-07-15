const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionStatus,
  verifyTransaction,
  verificationCodeTransaction,
} = require("../controllers/transactionController");

router.post("/createTransaction", createTransaction);
router.post("/verifyTransaction", verifyTransaction);
router.post("/OTPverifyTransaction", verificationCodeTransaction);
router.get("/:userId", getTransactionsByUser);
router.get("/transaction/:transactionId", getTransactionById);
router.patch("/transaction/:transactionId", updateTransactionStatus);

module.exports = router;
