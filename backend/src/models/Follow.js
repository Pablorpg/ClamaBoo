import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Company from "./Company.js";

const Follow = sequelize.define("Follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  timestamps: true,
  indexes: [
    { unique: true, fields: ["userId", "companyId"] }
  ]
});

User.belongsToMany(Company, { through: Follow, foreignKey: "userId", as: "following" });
Company.belongsToMany(User, { through: Follow, foreignKey: "companyId", as: "followers" });

export default Follow;