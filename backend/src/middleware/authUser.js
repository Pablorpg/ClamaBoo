import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function authUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Login necessário" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "user") {
      return res.status(403).json({ message: "Acesso permitido somente para usuários" });
    }

    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
