import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Company from "./Company.js";
import User from "./User.js";

const PetDonation = sequelize.define("PetDonation", {
    foto: DataTypes.STRING,
    nome: DataTypes.STRING,
    especie: DataTypes.STRING,
    idade: DataTypes.STRING,
    sexo: DataTypes.STRING,
    castrado: DataTypes.STRING,
    temperamento: DataTypes.STRING,
    local: DataTypes.STRING,
    mensagem: DataTypes.TEXT,
    contato: DataTypes.STRING,
    status: {
        type: DataTypes.STRING,
        defaultValue: "pendente"
    },

    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Company,
            key: "id",
        },
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    }
});

Company.hasMany(PetDonation, { foreignKey: "companyId" });
PetDonation.belongsTo(Company, { foreignKey: "companyId" });

User.hasMany(PetDonation, { foreignKey: "userId" });
PetDonation.belongsTo(User, { foreignKey: "userId" });

export default PetDonation;
