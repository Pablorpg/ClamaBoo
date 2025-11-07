const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResetEmail } = require("../utils/mailer");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "Já existe um usuário cadastrado com este e-mail." });

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists)
      return res.status(400).json({ message: "Este nome de usuário já está em uso." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Usuário criado com sucesso!", user });
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const messages = err.errors.map((e) => {
        if (e.validatorKey === "isEmail") return "O e-mail fornecido é inválido.";
        return e.message;
      });
      return res.status(400).json({ message: messages });
    }

    res.status(500).json({ message: "Ocorreu um erro ao criar o usuário. " + err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Este e-mail não está cadastrado." });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "A senha está incorreta." });
  }

  const token = jwt.sign(
    { id: user.id, type: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    message: "Login realizado com sucesso!",
    type: "user",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode.trim();
    await user.save();

    await sendResetEmail(user.email, resetCode);

    res.json({ message: "Código de recuperação enviado ao e-mail" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao enviar código de recuperação: " + err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.resetCode || user.resetCode.trim() !== code.trim()) {
      return res.status(400).json({ message: "Código inválido ou expirado" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao redefinir senha: " + err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar usuários: " + err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "createdAt"]
    });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar perfil: " + err.message });
  }
};
