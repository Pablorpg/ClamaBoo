const express = require("express");
const router = express.Router();
const { registerCompany, loginCompany, forgotPasswordCompany, resetPasswordCompany } = require("../controllers/companyAuthController");
const { searchCompanies, getCompanyById } = require("../controllers/companyController");
const authCompany = require("../middleware/authCompany");

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/dashboard", authCompany, (req, res) => {
  res.json({ message: "Dashboard da empresa", id: req.companyId });
});
router.post("/forgot-password", forgotPasswordCompany);
router.post("/reset-password", resetPasswordCompany);

router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);

module.exports = router;
