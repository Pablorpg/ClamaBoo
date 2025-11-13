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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

export default Follow;


User.hasMany(Follow, { foreignKey: "userId", onDelete: "CASCADE" });
Follow.belongsTo(User, { foreignKey: "userId" });

Company.hasMany(Follow, { foreignKey: "companyId", onDelete: "CASCADE" });
