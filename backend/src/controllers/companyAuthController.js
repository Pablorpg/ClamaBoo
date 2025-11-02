const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      responsibleName,
      email,
      password,
      phone,
      street,
      number,
      neighborhood,
      city,
      state,
      categories
    } = req.body;

    if (!companyName || !responsibleName || !email || !password || !phone || !categories) {
      return res.status(400).json({
        message: "Todos os campos obrigatórios devem ser preenchidos: companyName, responsibleName, email, password, phone e categories"
      });
    }

    let formattedCategories;
    if (typeof categories === "string") {
      try {
        formattedCategories = JSON.parse(categories);
      } catch {
        formattedCategories = [categories]
      }
    } else {
      formattedCategories = categories
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      companyName,
      responsibleName,
      email,
      password: hashedPassword,
      phone,
      street,
      number,
      neighborhood,
      city,
      state,
      categories: formattedCategories
    });

    return res.status(201).json({
      message: "Empresa cadastrada com sucesso!",
      company
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Erro ao cadastrar empresa",
      error: error.message
    });
  }
};

exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    const company = await Company.findOne({ where: { email } });

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    const match = await bcrypt.compare(password, company.password);
    if (!match) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: company.id, type: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      company
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro no login", error: error.message });
  }
};
