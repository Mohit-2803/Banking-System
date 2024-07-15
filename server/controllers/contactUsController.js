const ContactUs = require("../models/ContactUsSchema");
const User = require("../models/User");

// Create a new contact message
const createContactMessage = async (req, res) => {
  try {
    const { name, userId, subject, message } = req.body;

    const user = await User.findOne({ userId });
    const email = user.email;

    function generateRandomString(length) {
      const characters =
        "01234567890123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    // Generate a random string of 14 characters
    const randomString = generateRandomString(14);

    const newContactMessage = new ContactUs({
      name,
      userId,
      user: user._id,
      email,
      subject,
      ticket: randomString,
      message,
      status: "pending", // Initially setting status to pending
    });

    await newContactMessage.save();
    res.status(201).json({
      message: "Contact message saved successfully",
      data: randomString,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving contact message", error });
  }
};

// Update the status of a contact message
const updateContactMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedMessage = await ContactUs.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({
      message: "Contact message status updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating contact message status", error });
  }
};

// Get all contact messages
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find();
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact messages", error });
  }
};

// Get a single contact message by ID
const getContactMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await ContactUs.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact message", error });
  }
};

module.exports = {
  createContactMessage,
  updateContactMessageStatus,
  getAllContactMessages,
  getContactMessageById,
};
