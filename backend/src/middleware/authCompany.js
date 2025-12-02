import jwt from "jsonwebtoken";

export const authCompany = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
