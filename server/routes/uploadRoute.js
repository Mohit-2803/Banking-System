const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Import multer upload middleware
const User = require("../models/User");

// POST route to handle profile picture upload
router.post(
  "/uploadProfilePic/:userId",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const profilePicPath = req.file.path; // File path saved by multer

      const user = await User.findOne({ userId });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      // Update user with profile picture path
      user.profilePic = profilePicPath;
      await user.save();

      res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, error: "Failed to upload profile picture" });
    }
  }
);

module.exports = router;
