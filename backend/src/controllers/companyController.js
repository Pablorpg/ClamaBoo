import { Op, Sequelize } from "sequelize";
import Company from "../models/Company.js";

export const searchCompanies = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Categoria não informada." });
    }

    const companies = await Company.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "JSON_CONTAINS",
          Sequelize.col("categories"),
          JSON.stringify(category)
        ),
        1
      ),
      attributes: ["id", "companyName", "email", "phone"]
    });

    return res.json({ companies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar empresas." });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      attributes: ["id", "companyName", "description", "city", "state"]
    });

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar perfil da empresa" });
  }
};
