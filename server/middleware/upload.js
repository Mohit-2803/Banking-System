// middleware/upload.js

const multer = require("multer");
const path = require("path");

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination directory where files will be stored
  },
  filename: function (req, file, cb) {
    // Define how files should be named
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter for multer to accept only image files
const fileFilter = (req, file, cb) => {
  // Accept only jpeg, jpg, png, or gif files
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, or .gif files are allowed!"), false); // Reject file
  }
};

// Initialize multer upload with configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Max file size (5 MB)
  },
  fileFilter: fileFilter,
});

module.exports = upload;
