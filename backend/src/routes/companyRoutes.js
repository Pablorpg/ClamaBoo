import express from "express";
import multer from "multer";
import path from "path";
import {
  registerCompany,
  loginCompany,
  forgotPasswordCompany,
  resetPasswordCompany,
  getCompanyById,
  getCompanyProfileMe,
  updateCompanyProfileMe,
  searchCompanies,
  uploadCompanyLogo
} from "../controllers/companyController.js";

import authCompany from "../middleware/authCompany.js";
import Company from "../models/Company.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random() * 1e9}${ext}`);
  }
});
const upload = multer({ storage });

router.get("/profile/me", authCompany, getCompanyProfileMe);
router.put("/profile/me", authCompany, updateCompanyProfileMe);
router.put("/profile/me/logo", authCompany, upload.single("logo"), uploadCompanyLogo);

router.get("/search", searchCompanies);
router.get("/profile/:id", getCompanyById);

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.post("/forgot-password", forgotPasswordCompany);
router.post("/reset-password", resetPasswordCompany);

router.post("/delete-request", authCompany, async (req, res) => {
  try {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    if (company.deletedAt) {
      return res.status(400).json({ message: "Conta já foi excluída permanentemente" });
    }

    if (company.deletionScheduledAt) {
      return res.status(400).json({ message: "Exclusão já agendada" });
    }

    await company.update({
      deletionScheduledAt: new Date()
    });

    return res.json({ 
      message: "Exclusão agendada com sucesso", 
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

  } catch (err) {
    console.error("Erro ao agendar exclusão:", err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.post("/cancel-deletion", authCompany, async (req, res) => {
  try {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    if (!company.deletionScheduledAt || company.deletedAt) {
      return res.status(400).json({ message: "Nenhuma exclusão pendente" });
    }

    await company.update({
      deletionScheduledAt: null
    });

    return res.json({ message: "Exclusão cancelada com sucesso!" });

  } catch (err) {
    console.error("Erro ao cancelar exclusão:", err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default router;