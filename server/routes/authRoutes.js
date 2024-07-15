const express = require("express");
const {
  register,
  verifyCode,
  login,
  resendPasscode,
  createAccountInformation,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User"); // Import the User model
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/add-account", createAccountInformation);
router.post("/resend-passcode", resendPasscode);
router.post("/verify", verifyCode);

// Add the /me endpoint
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
