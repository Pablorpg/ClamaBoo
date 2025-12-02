import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResetEmail } from "../utils/mailer.js";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

export const authCompany = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADER RECEBIDO:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN DECODED:", decoded);

    if (!decoded || decoded.type !== "company") {
      return res.status(403).json({ message: "Acesso negado. Não é empresa." });
    }

    req.companyId = decoded.id;

    next();
  } catch (err) {
    console.error("Erro no authCompany:", err);
    return res.status(401).json({ message: "Token inválido" });
  }
};


export const register = async (req, res) => {
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
    res.status(500).json({ message: "Erro ao criar usuário: " + err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(400).json({ message: "Este e-mail não está cadastrado." });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json({ message: "A senha está incorreta." });

  const token = jwt.sign({ id: user.id, type: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    message: "Login realizado com sucesso!",
    type: "user",
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
};

export const forgotPassword = async (req, res) => {
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

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.resetCode || user.resetCode.trim() !== code.trim())
      return res.status(400).json({ message: "Código inválido ou expirado" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao redefinir senha: " + err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar usuários: " + err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "username", "email", "createdAt"]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Erro ao carregar perfil" });
  }
};

export const updateProfileUser = async (req, res) => {
  try {
    const { username, email, senhaAtual, novaSenha } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    if (username) {
      user.username = username.trim();
    }

    if (email) {
      const existing = await User.findOne({
        where: {
          email: email.toLowerCase().trim(),
          id: { [Op.ne]: req.userId }
        }
      });

      if (existing) {
        return res.status(400).json({ message: "Este email já está em uso" });
      }

      user.email = email.toLowerCase().trim();
    }

    if (senhaAtual && novaSenha) {
      const valid = await bcrypt.compare(senhaAtual, user.password);

      if (!valid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }

      user.password = await bcrypt.hash(novaSenha, 10);
    }

    await user.save();

    res.json({
      message: "Perfil atualizado com sucesso!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar perfil: " + err.message });
  }
};
