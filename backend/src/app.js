const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const companyAuthRoutes = require("./routes/companyAuthRoutes");
const sequelize = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/company", companyAuthRoutes);

sequelize
  .sync()
  .then(() => console.log("Banco de dados sincronizado"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err));

module.exports = app;
