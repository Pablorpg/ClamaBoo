import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import companyAuthRoutes from "./routes/companyAuthRoutes.js";
import followRoutes from "./routes/followRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/company", companyAuthRoutes);
app.use("/api/follow", followRoutes);

try {
  await sequelize.sync();
  console.log("Banco de dados sincronizado com sucesso!");
} catch (err) {
  console.error("Erro ao sincronizar banco de dados:", err);
}

export default app;
