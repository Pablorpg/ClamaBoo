const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const { sendResetEmail } = require("../utils/mailer");

exports.registerCompany = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const existing = await Company.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Este email já está cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = jwt.sign(
      { id: company.id, type: "company" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Empresa cadastrada com sucesso!",
      type: "company",
      token,
      company: {
        id: company.id,
        companyName: company.companyName,
        email: company.email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar empresa", error });
  }
};

exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(404).json({ message: "Email não cadastrado" });
    }

    const match = await bcrypt.compare(password, company.password);
    if (!match) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: company.id, type: "company" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login realizado com sucesso!",
      type: "company",
      token,
      company: {
        id: company.id,
        companyName: company.companyName,
        email: company.email,
      }
    });

  } catch (error) {
    console.log("Erro login empresa:", error);
    return res.status(500).json({ message: "Erro no login", error: error.message });

  }
};

exports.forgotPasswordCompany = async (req, res) => {
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

exports.resetPasswordCompany = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const company = await Company.findOne({ where: { email } });

    if (!company || company.resetCode !== code.trim()) {
      return res.status(400).json({ message: "Código inválido ou expirado" });
    }

    company.password = await bcrypt.hash(newPassword, 10);
    company.resetCode = null;
    await company.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao redefinir senha: " + err.message });
  }
};