const express = require("express");
const connectDB = require("./config/db");
const userController = require("./controllers/userController");
const cors = require("cors");
const multer = require("multer"); // Import multer for file uploads
const path = require("path");

connectDB();

const app = express();
app.use(cors()); // Use cors middleware to handle CORS

app.use(express.json());

// Main Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/transactions", require("./routes/transationRoutes"));
app.use("/api/messages", require("./routes/contactUsRoutes"));
app.use("/api/beneficiary", require("./routes/beneficiaryRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Multer middleware setup for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, or .gif files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB file size limit
  },
  fileFilter: fileFilter,
});

// Serve static files (profile pictures)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// User route for fetching user details by ID
app.get("/api/users/:userId", userController.getUserById);
// Route for handling profile picture uploads
app.use("/api/upload", require("./routes/uploadRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
