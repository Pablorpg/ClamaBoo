import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import "./models/User.js";
import "./models/Company.js";
import "./models/Follow.js";

import companyRoutes from "./routes/companyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import donateRoutes from "./routes/donateRoutes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/donate", donateRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API ClamaBoo rodando!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno no servidor" });
});

export default app;
