import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Company = sequelize.define("Company", {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsibleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  cnpj: {
    type: DataTypes.STRING,
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Company;
