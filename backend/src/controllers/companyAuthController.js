import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import { sendResetEmail } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

export const registerCompany = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const existing = await Company.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Este email já está cadastrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = jwt.sign({ id: company.id, type: "company" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Empresa cadastrada com sucesso!",
      type: "company",
      token,
      company: { id: company.id, companyName: company.companyName, email: company.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar empresa", error });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ where: { email } });

    if (!company) return res.status(404).json({ message: "Email não cadastrado" });

    const match = await bcrypt.compare(password, company.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: company.id, type: "company" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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

    if (!company) return res.status(404).json({ message: "Empresa não encontrada" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    company.resetCode = resetCode;
    await company.save();

    await sendResetEmail(company.email, resetCode);

    res.json({ message: "Código de recuperação enviado ao e-mail" });
  } catch (err) {
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
    res.status(500).json({ message: "Erro ao redefinir senha: " + err.message });
  }
};
