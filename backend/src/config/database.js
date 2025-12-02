import { Sequelize } from "sequelize";

const sequelize = new Sequelize("clamaboo", "clamaboo_user", "123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
  },
});

export default sequelize;