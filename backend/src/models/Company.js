import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
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
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  cnpj: {
    type: DataTypes.STRING,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  objectives: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  certificates: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletionScheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Company;
