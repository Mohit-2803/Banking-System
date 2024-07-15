const User = require("../models/User");
const AccountInformation = require("../models/AccountInformation");
const VerificationCode = require("../models/verificationCode");
const createTransporter = require("../config/nodemailerConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EMAIL_USER = process.env.EMAIL_USER;

const register = async (req, res) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    let userEmail = await User.findOne({ email });
    let userIdd = await User.findOne({ userId });
    if (userIdd) {
      return res.status(400).json({ message: "User ID already exists" });
    }
    if (userEmail) {
      return res.status(400).json({ message: "User Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      userId,
      email,
      password: hashedPassword,
      isVerified: false,
      isAccountAdded: false,
      passwordCreatedAt: new Date(),
      passwordUpdatedAt: new Date(),
    });

    const newVerificationCode = new VerificationCode({
      email,
      passcode: verificationCode,
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    const transporter = await createTransporter();

    const mailOptions = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Passcode Confirmation</h2>
          <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
          <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You have requested a passcode for account verification with YourBank.</p>
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <strong>${verificationCode}</strong>
          </div>
          <p style="font-size: 16px; color: #666666; margin-top: 20px;">Please use the above passcode to verify your account.</p>
          <p style="font-size: 16px; color: #666666;">If you did not request this passcode, please ignore this email or contact customer support immediately.</p>
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
    await newUser.save();
    await newVerificationCode.save();
    res.status(201).json({ message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyCode = async (req, res) => {
  const { email, passcode } = req.body;
  const user = await User.findOne({ email });

  if (!email || !passcode) {
    return res
      .status(400)
      .json({ message: "Email and verification code are required" });
  }

  try {
    const verificationCode = await VerificationCode.findOne({
      email,
      passcode,
    });

    if (!verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (Date.now() > verificationCode.expiresAt) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    await User.findOneAndUpdate({ email }, { isVerified: true });

    await VerificationCode.deleteOne({ email, passcode });

    // check if account is created or not
    if (!user.isAccountAdded) {
      return res
        .status(200)
        .json({ success: true, error: "Account is not created" });
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendPasscode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newVerificationCode = {
      passcode: verificationCode,
      expiresAt: Date.now() + 3600000, // 1 hour
    };

    await VerificationCode.findOneAndUpdate({ email }, newVerificationCode, {
      upsert: true,
      new: true,
    });

    const transporter = await createTransporter();

    const mailOptions = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email,
      subject: "Resend: Email Verification Code",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
  <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Passcode Confirmation</h2>
  <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
  <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You have requested a new passcode for account verification with YourBank.</p>
  <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <strong>${verificationCode}</strong>
  </div>
  <p style="font-size: 16px; color: #666666; margin-top: 20px;">Please use the above passcode to verify your account.</p>
  <p style="font-size: 16px; color: #666666;">If you did not request this passcode, please ignore this email or contact customer support immediately.</p>
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

    res.status(200).json({ message: "Verification code resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res
      .status(400)
      .json({ success: false, error: "User ID and password are required" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    // If user is there but not verified, send him to verification page and send passcode to email
    if (!user.isVerified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const newVerificationCode = new VerificationCode({
        email: user.email,
        passcode: verificationCode,
        expiresAt: Date.now() + 3600000, // 1 hour
      });

      const transporter = await createTransporter();

      const mailOptions = {
        from: `PREMIUM BANK <${EMAIL_USER}>`,
        to: user.email,
        subject: "Email Verification Code",
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <img src="https://getlogo.net/wp-content/uploads/2020/03/mybank-logo-vector.png" alt="YourBank Logo" style="display: block; margin: 0 auto 20px; max-width: 150px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Passcode Confirmation</h2>
          <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
          <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You have requested a passcode for account verification with YourBank.</p>
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <strong>${verificationCode}</strong>
          </div>
          <p style="font-size: 16px; color: #666666; margin-top: 20px;">Please use the above passcode to verify your account.</p>
          <p style="font-size: 16px; color: #666666;">If you did not request this passcode, please ignore this email or contact customer support immediately.</p>
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

      return res.status(200).json({
        success: true,
        error: "Account is not verified",
        email: user.email,
      });
    }

    // If account is not created, redirect user to create account page
    if (!user.isAccountAdded) {
      return res.status(200).json({
        success: false,
        error: "Account is not created",
        email: user.email,
      });
    }

    // Update lastLoginAt
    user.lastLoginAt = Date.now();
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const lastLoginAt = user.lastLoginAt;

    // Return user data and token
    res.status(200).json({ success: true, token, user, lastLoginAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

const createAccountInformation = async (req, res) => {
  const { accountNumber, accountType, initialDeposit, userId, email } =
    req.body;

  try {
    // Ensure the user exists
    let user;
    if (userId) {
      user = await User.findOne({ userId });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure account number is unique
    const existingAccount = await AccountInformation.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(400).json({ message: "Account Number already exists" });
    }

    // Create AccountInformation document
    const accountInformation = new AccountInformation({
      accountNumber,
      accountType,
      balance: initialDeposit,
      user: user._id,
    });

    // Save AccountInformation document
    await accountInformation.save();

    // Update user to mark account as added
    user.isAccountAdded = true;
    await user.save();

    res.status(201).json({
      message: "AccountInformation created successfully",
      accountInformation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  verifyCode,
  resendPasscode,
  createAccountInformation,
};
