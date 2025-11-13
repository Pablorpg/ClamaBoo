import express from "express";
import { searchCompanies, getCompanyById } from "../controllers/companyController.js";

const router = express.Router();

router.get("/search", searchCompanies);

router.get("/:id", getCompanyById);

export default router;
