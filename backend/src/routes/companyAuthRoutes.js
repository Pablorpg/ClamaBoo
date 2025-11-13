import express from "express";
import {
  registerCompany,
  loginCompany,
  forgotPasswordCompany,
  resetPasswordCompany
} from "../controllers/companyAuthController.js";

import {
  searchCompanies,
  getCompanyById
} from "../controllers/companyController.js";

import authCompany from "../middleware/authCompany.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/dashboard", authCompany, (req, res) => {
  res.json({ message: "Dashboard da empresa", id: req.companyId });
});
router.post("/forgot-password", forgotPasswordCompany);
router.post("/reset-password", resetPasswordCompany);

router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);

export default router;
