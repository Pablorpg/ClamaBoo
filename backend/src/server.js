import app from "./app.js";
import sequelize from "./config/database.js";
import "./jobs/deleteExpiredCompanies.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Banco recriado com sucesso");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
};

startServer();
