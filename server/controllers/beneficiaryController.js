const Beneficiary = require("../models/beneficiarySchema");
const User = require("../models/User");

// Controller function to add a beneficiary
const addBeneficiary = async (req, res) => {
  const { userId, name, accountNumber } = req.body;

  try {
    const user = await User.findOne({ userId });

    // Create a new beneficiary instance
    const newBeneficiary = new Beneficiary({
      userId,
      user: user._id,
      name,
      accountNumber,
    });

    // Save the beneficiary to the database
    const savedBeneficiary = await newBeneficiary.save();

    res.status(201).json(savedBeneficiary);
  } catch (error) {
    console.error("Error adding beneficiary:", error);
    res.status(500).json({ error: "Failed to add beneficiary" });
  }
};

// Controller function to get all beneficiaries for a user
const getAllBeneficiaries = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all beneficiaries associated with the userId
    const beneficiaries = await Beneficiary.find({ userId });

    res.status(200).json({ data: beneficiaries });
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    res.status(500).json({ error: "Failed to fetch beneficiaries" });
  }
};

// Controller function to delete a beneficiary by ID
const deleteBeneficiary = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the beneficiary by ID and delete it
    await Beneficiary.findByIdAndDelete(id);

    res.status(200).json({ message: "Beneficiary deleted successfully" });
  } catch (error) {
    console.error("Error deleting beneficiary:", error);
    res.status(500).json({ error: "Failed to delete beneficiary" });
  }
};

module.exports = {
  addBeneficiary,
  getAllBeneficiaries,
  deleteBeneficiary,
};
