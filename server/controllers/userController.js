const User = require("../models/User");
const AccountInformation = require("../models/AccountInformation");

const getUserById = async (req, res) => {
  const userId = req.params;

  try {
    const user = await User.findOne(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Fetch account information associated with the user
    const accountInfo = await AccountInformation.findOne({ user: user._id });
    if (!accountInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Account information not found" });
    }

    res.status(200).json({ success: true, data: { user, accountInfo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Failed to get user and account information",
    });
  }
};

module.exports = { getUserById };
