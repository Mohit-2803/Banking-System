const express = require("express");
const router = express.Router();
const {
  addBeneficiary,
  getAllBeneficiaries,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

router.post("/addBeneficiary", addBeneficiary);
router.get("/:userId", getAllBeneficiaries);
router.get("/deleteBeneficiary", deleteBeneficiary);

module.exports = router;
