import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authCompany(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login necessário" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "company") {
      return res.status(403).json({ message: "Acesso permitido somente para empresas" });
    }

    req.companyId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
