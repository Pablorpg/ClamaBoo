import app from "./app.js";
import sequelize from "./config/database.js";
import "./jobs/deleteExpiredCompanies.js";

const PORT = 5000;

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Banco de dados 'clamaboo' recriado com sucesso!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log("Acesse o frontend em http://localhost:5173");
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco:", error);
    process.exit(1);
  }
};

startServer();