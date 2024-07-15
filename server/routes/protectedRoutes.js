// protectedRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getUserById } = require("../controllers/userController"); // Import the profile controller function

const router = express.Router();

// Example protected route for fetching user profile
router.get("/home", authMiddleware, getUserById);

module.exports = router;
