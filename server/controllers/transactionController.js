const SentTransaction = require("../models/SentTransactionSchema");
const ReceivedTransaction = require("../models/ReceivedTransactionSchema");
const AccountInformation = require("../models/AccountInformation");
const User = require("../models/User");
const VerificationCode = require("../models/verificationCode");
const createTransporter = require("../config/nodemailerConfig");
const EMAIL_USER = process.env.EMAIL_USER;

const createSentTransaction = async (
  userId,
  type,
  amount,
  description,
  recipientAccountNumber
) => {
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }

    const account = await AccountInformation.findOne({ user: user._id });
    if (!account) {
      throw new Error("Account not found");
    }

    let recipientAccount = null;
    if (type === "transfer" || type === "payment") {
      recipientAccount = await AccountInformation.findOne({
        accountNumber: recipientAccountNumber,
      });
      if (!recipientAccount) {
        throw new Error("Recipient account not found");
      }
    }

    const recipient = await User.findOne({ _id: recipientAccount.user });
    if (!recipient) {
      throw new Error("Recipient not found");
    }

    const generateRandomNineDigitNumber = () => {
      const min = 100000000;
      const max = 999999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const randomNineDigitNumber = generateRandomNineDigitNumber();

    // Create the transaction
    const transaction = new SentTransaction({
      user: user._id,
      userId: userId,
      accountId: account._id,
      type,
      amount: Number(amount),
      referenceNumber: randomNineDigitNumber,
      description,
      status: "successful",
      recipientAccountNumber: recipientAccount.accountNumber,
      recipientId: recipient.userId,
      recipientAccount: recipientAccount._id,
    });

    // Save the transaction
    await transaction.save();

    // Update the account balance if the transaction is a transfer
    if (type === "transfer") {
      account.balance -= Number(amount);
      await recipientAccount.save();
      await account.save();
    }

    // After successful creating transaction send mail to user that money got deducted from account
    const email = user.email;

    const transporter = await createTransporter();

    const currentDate = new Date();
    const transactionDate = currentDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const transactionTime = currentDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const accountNumber = account.accountNumber;

    const mailOptions = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email,
      subject: "Transaction Alert: Amount Deducted from Your Account",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Transaction Alert</h2>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">We would like to inform you that an amount of <strong>Rs ${amount}</strong> has been deducted from your account <strong>${accountNumber}</strong> on <strong>${transactionDate}</strong> at <strong>${transactionTime}</strong>.</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 18px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <strong>Transaction Details:</strong>
        <p>Recipient Account Number: ${recipientAccountNumber}</p>
        <p>Description: ${description}</p>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">If you did not authorize this transaction, please contact our customer service immediately.</p>
      <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <p style="font-size: 14px; color: #999999;">This email was sent by YourBank. Please do not reply to this email.</p>
        <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="Social Media Icons" style="width: 100px;">
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 10px;">Follow us on social media for updates and news:</p>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <a href="https://facebook.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://www.logo.wine/a/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.svg" alt="Facebook Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Facebook
        </a>
        <a href="https://twitter.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/258px-Twitter_bird_logo_2012.svg.png?20141014130605" alt="Twitter Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Twitter
        </a>
        <a href="https://instagram.com/yourbank" style="text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Instagram
        </a>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px;">YourBank, 123 Bank Street, City, Country</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    return transaction;
  } catch (error) {
    console.error("Failed to create sender transaction:", error);
    throw error;
  }
};

const createReceivedTransaction = async (
  senderId,
  type,
  amount,
  description,
  senderAccountId,
  referenceNumber,
  receiverAccountNumber
) => {
  try {
    const senderAccount = await AccountInformation.findOne({
      _id: senderAccountId,
    });

    const sender = await User.findOne({
      _id: senderAccount.user,
    });

    const receiverAccount = await AccountInformation.findOne({
      accountNumber: receiverAccountNumber,
    });

    const receiver = await User.findOne({
      _id: receiverAccount.user,
    });

    if (!senderAccount) {
      throw new Error("Sender account not found");
    }

    const senderUser = await User.findOne({ _id: senderAccount.user });
    if (!senderUser) {
      throw new Error("Sender user not found");
    }

    // Create the transaction for the receiver
    const transaction = new ReceivedTransaction({
      user: receiver._id, // Store sender as receiver user
      userId: receiver.userId,
      accountId: receiverAccount._id,
      type: "receive",
      amount: Number(amount),
      referenceNumber,
      description,
      status: "successful",
      senderId: sender.userId,
      senderAccountNumber: senderAccount.accountNumber,
      senderAccount: senderAccount._id,
    });

    // Save the transaction for the receiver
    await transaction.save();

    // Update the receiver's account balance
    receiverAccount.balance += Number(amount);
    await receiverAccount.save();

    // Send mail to receiver that amount is received to your bank
    const currentDate = new Date();
    const transactionDate = currentDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const transactionTime = currentDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const senderAccountNumber = senderAccount.accountNumber;
    const email = receiver.email;

    const transporter = await createTransporter();

    const mailOptionsReceiver = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email, // Receiver's email
      subject: "Transaction Alert: Amount Credited to Your Account",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Transaction Alert</h2>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">We would like to inform you that an amount of <strong>${amount}</strong> has been credited to your account <strong>${receiverAccountNumber}</strong> on <strong>${transactionDate}</strong> at <strong>${transactionTime}</strong>.</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 18px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <strong>Transaction Details:</strong>
        <p>Sender Account Number: ${senderAccountNumber}</p>
        <p>Description: ${description}</p>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">If you did not authorize this transaction, please contact our customer service immediately.</p>
      <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <p style="font-size: 14px; color: #999999;">This email was sent by YourBank. Please do not reply to this email.</p>
        <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="Social Media Icons" style="width: 100px;">
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 10px;">Follow us on social media for updates and news:</p>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <a href="https://facebook.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://www.logo.wine/a/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.svg" alt="Facebook Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Facebook
        </a>
        <a href="https://twitter.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/258px-Twitter_bird_logo_2012.svg.png?20141014130605" alt="Twitter Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Twitter
        </a>
        <a href="https://instagram.com/yourbank" style="text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Instagram
        </a>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px;">YourBank, 123 Bank Street, City, Country</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptionsReceiver);

    return transaction;
  } catch (error) {
    console.error("Failed to create receiver transaction:", error);
    throw error;
  }
};

const createTransaction = async (req, res) => {
  const { userId, type, amount, description, recipientAccountNumber } =
    req.body;

  // Validate input
  if (!userId || !type || !amount) {
    return res
      .status(400)
      .json({ success: false, error: "Required fields are missing" });
  }

  try {
    const sentTransaction = await createSentTransaction(
      userId,
      type,
      amount,
      description,
      recipientAccountNumber
    );

    // Invoke receiver transaction function if applicable
    if (type === "transfer") {
      await createReceivedTransaction(
        sentTransaction.userId,
        type,
        amount,
        description,
        sentTransaction.accountId,
        sentTransaction.referenceNumber,
        recipientAccountNumber
      );
    }

    res.status(201).json({ success: true, data: sentTransaction });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create transaction" });
  }
};

// Get all transactions for a user
const getTransactionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all sent transactions
    const sentTransactions = await SentTransaction.find({ userId });
    // Find all received transactions
    const receivedTransactions = await ReceivedTransaction.find({ userId });

    res.status(200).json({
      success: true,
      data: { sentTransactions, receivedTransactions },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve transactions" });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Check in sent transactions
    let transaction = await SentTransaction.findById(transactionId);
    if (!transaction) {
      // Check in received transactions if not found in sent
      transaction = await ReceivedTransaction.findById(transactionId);
    }
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve transaction" });
  }
};

// Update transaction status (for both sent and received)
const updateTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  // Validate input
  if (!status) {
    return res
      .status(400)
      .json({ success: false, error: "Status is required" });
  }

  try {
    // Update in sent transactions
    let transaction = await SentTransaction.findById(transactionId);
    if (!transaction) {
      // Update in received transactions if not found in sent
      transaction = await ReceivedTransaction.findById(transactionId);
    }
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update transaction status" });
  }
};

// verify the transaction by otp sent to your email
const verifyTransaction = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "UserId not found" });
    }

    const email = user.email;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newVerificationCode = new VerificationCode({
      email,
      passcode: verificationCode,
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    const transporter = await createTransporter();

    const mailOptions = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email, // Replace with the recipient's email address
      subject: "Transaction OTP Confirmation",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Transaction OTP Confirmation</h2>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You have initiated a transaction of Rs ${amount} from your account with YourBank.</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <strong>${verificationCode}</strong>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">Please use the above OTP to confirm your transaction.</p>
      <p style="font-size: 16px; color: #666666;">If you did not initiate this transaction, please contact customer support immediately.</p>
      <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <p style="font-size: 14px; color: #999999;">This email was sent by YourBank. Please do not reply to this email.</p>
        <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="width: 100px;">
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 10px;">Follow us on social media for updates and news:</p>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <a href="https://facebook.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://www.logo.wine/a/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.svg" alt="Facebook Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Facebook
        </a>
        <a href="https://twitter.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://upload.wikimedia.org/wikipedia/sco/thumb/9/9f/Twitter_bird_logo_2012.svg/258px-Twitter_bird_logo_2012.svg.png?20141014130605g" alt="Twitter Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Twitter
        </a>
        <a href="https://instagram.com/yourbank" style="text-decoration: none;">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Instagram
        </a>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px;">YourBank, 123 Bank Street, City, Country</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    await newVerificationCode.save();
    res.status(201).json({ message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verificationCodeTransaction = async (req, res) => {
  const { userId, passcode } = req.body;

  try {
    // Find user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user's email for further use
    const email = user.email;

    // Find verification code matching email and passcode
    const verificationCode = await VerificationCode.findOne({
      email,
      passcode,
    });
    if (!verificationCode) {
      return res.status(404).json({ message: "Invalid passcode" });
    }

    // Check if the verification code has expired
    if (Date.now() > verificationCode.expiresAt) {
      return res.status(400).json({ message: "Passcode has expired" });
    }

    // Delete the used verification code
    await VerificationCode.deleteOne({ email, passcode });

    // Respond with success message
    res.status(200).json({ message: "Transaction verified successfully" });
  } catch (error) {
    console.error("Error verifying transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionStatus,
  verifyTransaction,
  verificationCodeTransaction,
};
