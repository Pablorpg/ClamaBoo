
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PetDonation = sequelize.define("PetDonation", {
    foto: { type: DataTypes.STRING, allowNull: false },
    nome: { type: DataTypes.STRING },
    especie: { type: DataTypes.STRING, defaultValue: "Cachorro" },
    idade: { type: DataTypes.STRING },
    sexo: { type: DataTypes.STRING },
    castrado: { type: DataTypes.STRING },
    temperamento: { type: DataTypes.STRING },
    local: { type: DataTypes.STRING, allowNull: false },
    mensagem: { type: DataTypes.TEXT },
    contato: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pendente" },
});

export default PetDonation;