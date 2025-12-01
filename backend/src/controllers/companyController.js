import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import Company from "../models/Company.js";
import { sendResetEmail } from "../utils/mailer.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

export const registerCompany = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const existing = await Company.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Este email já está cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = jwt.sign(
      { id: company.id, type: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Empresa cadastrada com sucesso!",
      type: "company",
      token,
      company: {
        id: company.id,
        companyName: company.companyName,
        email: company.email,
      },
    });
  } catch (error) {
    console.error("Erro cadastro empresa:", error);
    return res.status(500).json({
      message: "Erro ao cadastrar empresa",
      error: error.message,
    });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({
      where: { email },
      attributes: ["id", "companyName", "email", "password"],
    });

    if (!company)
      return res.status(404).json({ message: "Email não cadastrado" });

    const match = await bcrypt.compare(password, company.password);
    if (!match)
      return res.status(400).json({ message: "Senha incorreta" });

    const token = jwt.sign(
      { id: company.id, type: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login realizado com sucesso!",
      type: "company",
      token,
      company: {
        id: company.id,
        companyName: company.companyName,
        email: company.email,
      },
    });
  } catch (error) {
    console.error("Erro login empresa:", error);
    res.status(500).json({ message: "Erro no login", error: error.message });
  }
};

export const forgotPasswordCompany = async (req, res) => {
  try {
    const { email } = req.body;

    const company = await Company.findOne({ where: { email } });
    if (!company)
      return res.status(404).json({ message: "Empresa não encontrada" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    company.resetCode = resetCode;
    await company.save();

    await sendResetEmail(company.email, resetCode);

    res.json({ message: "Código de recuperação enviado ao e-mail" });
  } catch (err) {
    console.error("Erro forgotPasswordCompany:", err);
    res.status(500).json({ message: "Erro ao enviar código: " + err.message });
  }
};

export const resetPasswordCompany = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const company = await Company.findOne({ where: { email } });

    if (!company || company.resetCode !== code.trim())
      return res.status(400).json({ message: "Código inválido ou expirado" });

    company.password = await bcrypt.hash(newPassword, 10);
    company.resetCode = null;

    await company.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error("Erro resetPasswordCompany:", err);
    res.status(500).json({ message: "Erro ao redefinir senha: " + err.message });
  }
};

export const searchCompanies = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category)
      return res.status(400).json({ message: "Categoria não informada." });

    const companies = await Company.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("categories"),
          JSON.stringify(category)
        ),
        1
      ),
      attributes: ["id", "companyName", "email", "phone", "profileImage", "categories"],
    });

    return res.json({ companies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar empresas." });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Empresa não encontrada" });

    if (typeof company.certificates === "string") {
      company.certificates = company.certificates.split(",").map(s => s.trim());
    }

    return res.json({ company });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    await company.update(req.body);

    return res.json({ company });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};

export const updateCompanyProfileMe = async (req, res) => {
  try {
    const company = await Company.findByPk(req.companyId);
    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    await company.update({
      companyName: req.body.companyName || company.companyName,
      responsibleName: req.body.responsibleName || company.responsibleName,
      phone: req.body.phone || null,
      about: req.body.about || company.about,
      objectives: req.body.objectives || company.objectives,
      categories: req.body.categories || company.categories,
      certificates: req.body.certificates || company.certificates,
    });

    res.json({ company: await Company.findByPk(req.companyId) });
  } catch (err) {
    console.error("Erro update:", err);
    res.status(500).json({ message: err.message });
  }
};

export const uploadCompanyLogo = async (req, res) => {
  try {
    const companyId = req.companyId;
    if (!companyId) return res.status(401).json({ message: "Não autorizado" });

    if (!req.file) return res.status(400).json({ message: "Arquivo não enviado" });

    const filePath = `/uploads/${req.file.filename}`;

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: "Empresa não encontrada" });

    if (company.profileImage) {
      try {
        const oldFile = path.join(process.cwd(), company.profileImage);
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      } catch (e) { }
    }

    company.profileImage = filePath;
    await company.save();

    return res.json({ message: "Logo enviada com sucesso", profileImage: filePath });
  } catch (err) {
    console.error("Erro uploadCompanyLogo:", err);
    return res.status(500).json({ message: "Erro ao enviar logo: " + err.message });
  }
};

export const getCompanyDashboard = async (req, res) => {
  try {
    const company = await Company.findByPk(req.companyId, {
      attributes: ["id", "companyName", "email", "phone", "about", "objectives", "certificates", "profileImage", "categories", "createdAt"]
    });

    if (!company)
      return res.status(404).json({ message: "Empresa não encontrada" });

    if (typeof company.certificates === "string") {
      company.certificates = company.certificates.split(",").map(s => s.trim());
    }

    return res.json(company);
  } catch (err) {
    console.error("Erro dashboard:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const getCompanyProfileMe = async (req, res) => {
  try {
    console.log("Token decodificado:", req.companyId);
    const company = await Company.findByPk(req.companyId, {
      attributes: { exclude: ["password", "resetCode"] }
    });

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    res.json({ company });
  } catch (err) {
    console.error("Erro getCompanyProfileMe:", err);
    res.status(500).json({ message: "Erro interno" });
  }
};
