import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export default async function authUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token necessário" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "user") {
      return res.status(403).json({ message: "Acesso negado: apenas usuários" });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "username", "email"]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (err) {
    console.error("Erro authUser:", err.message);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}