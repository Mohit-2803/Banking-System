const Loan = require("../models/loanSchema");
const User = require("../models/User");
const createTransporter = require("../config/nodemailerConfig");
const EMAIL_USER = process.env.EMAIL_USER;

// Controller to handle creating a new loan application
exports.createLoan = async (req, res) => {
  try {
    const { userId, loanType, loanAmount, purpose } = req.body;

    const user = await User.findOne({ userId });

    // Create a new loan document
    const newLoan = new Loan({
      userId,
      user,
      loanType,
      loanAmount,
      purpose,
    });

    // Send mail to user that he/she have applied for loan
    const email = user.email;
    const transporter = await createTransporter();

    const mailOptions = {
      from: `PREMIUM BANK <${EMAIL_USER}>`,
      to: email,
      subject: "Loan Application Submitted Successfully",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4zBF0F-DmSKPAH4zKXJeMK0jIGjigHvDwSQ&s" alt="YourBank Logo" style="max-width: 150px;">
      </div>
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; text-align: center; margin-bottom: 20px;">Loan Application Submitted Successfully</h2>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 18px; color: #333333; margin-bottom: 10px;">Dear Valued Customer,</p>
        <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Thank you for submitting your loan application with YourBank. We have successfully received your application details and our team will review it shortly.</p>
        <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
        <div style="font-size: 16px; color: #333333;">
          <p><strong>Loan Application Details:</strong></p>
          <p><strong>Loan Type:</strong> ${loanType}</p>
          <p><strong>Purpose of Loan:</strong> ${purpose}</p>
          <p><strong>Requested Amount:</strong> Rs ${loanAmount}</p>
        </div>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">Our team will contact you if further information is required. Thank you for choosing Premium Bank for your financial needs.</p>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px;">
        <p style="font-size: 14px; color: #999999;">This email was sent by Premium Bank. Please do not reply to this email.</p>
        <img src="https://example.com/social-icons.png" alt="Social Media Icons" style="width: 100px;">
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 10px; text-align: center;">Follow us on social media for updates and news:</p>
      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <a href="https://facebook.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://e7.pngegg.com/pngimages/168/713/png-clipart-logo-facebook-inc-social-media-nasdaq-fb-seo-blue-text.png" alt="Facebook Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Facebook
        </a>
        <a href="https://twitter.com/yourbank" style="text-decoration: none; margin-right: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI-h-e2hgz8mwGfCt4gvj4IgMG_wAUolVM6w&s" alt="Twitter Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Twitter
        </a>
        <a href="https://instagram.com/yourbank" style="text-decoration: none;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4zBF0F-DmSKPAH4zKXJeMK0jIGjigHvDwSQ&s" alt="Instagram Icon" style="width: 30px; margin-right: 5px; vertical-align: middle;">
          Instagram
        </a>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px; text-align: center;">Premium Bank, 123 Bank Street, City, India</p>
    </div>
  `,
    };
    await transporter.sendMail(mailOptions);

    // Save the loan application to the database
    await newLoan.save();

    res.status(201).json({ success: true, data: newLoan });
  } catch (err) {
    console.error("Error creating loan:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to create loan application" });
  }
};

// Controller to fetch all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId", "username email"); // Example population if userId is referencing a User schema

    res.status(200).json({ success: true, data: loans });
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ success: false, error: "Failed to fetch loans" });
  }
};

// Controller to fetch a single loan by ID
exports.getLoanById = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ success: false, error: "Loan not found" });
    }

    res.status(200).json({ success: true, data: loan });
  } catch (err) {
    console.error("Error fetching loan by ID:", err);
    res.status(500).json({ success: false, error: "Failed to fetch loan" });
  }
};

// Controller to update a loan application
exports.updateLoan = async (req, res) => {
  const { id } = req.params;
  const { loanType, loanAmount, purpose } = req.body;

  try {
    let loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ success: false, error: "Loan not found" });
    }

    // Update loan fields
    loan.loanType = loanType;
    loan.loanAmount = loanAmount;
    loan.purpose = purpose;

    // Save updated loan to the database
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (err) {
    console.error("Error updating loan:", err);
    res.status(500).json({ success: false, error: "Failed to update loan" });
  }
};

// Controller to delete a loan application
exports.deleteLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ success: false, error: "Loan not found" });
    }

    await loan.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error("Error deleting loan:", err);
    res.status(500).json({ success: false, error: "Failed to delete loan" });
  }
};
