const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
        allowNull: false,
    },
    categories: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});

Company.associate = (models) => {
    Company.belongsToMany(models.User, {
        through: "CompanyFollowers",
        as: "followers",
        foreignKey: "companyId",
    });
};

module.exports = Company;
