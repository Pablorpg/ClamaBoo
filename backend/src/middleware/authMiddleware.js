import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  });
};
