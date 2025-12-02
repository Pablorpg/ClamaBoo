import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

export const authCompany = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

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
