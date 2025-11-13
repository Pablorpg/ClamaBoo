import Follow from "../models/Follow.js";
import Company from "../models/Company.js";

export const followCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.companyId;

    const existingFollow = await Follow.findOne({ where: { userId, companyId } });
    if (existingFollow) {
      return res.status(400).json({ message: "Você já segue essa empresa." });
    }

    await Follow.create({ userId, companyId });
    res.json({ message: "Empresa seguida com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao seguir empresa." });
  }
};

export const unfollowCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.companyId;

    const follow = await Follow.findOne({ where: { userId, companyId } });
    if (!follow) {
      return res.status(404).json({ message: "Você não segue essa empresa." });
    }

    await follow.destroy();
    res.json({ message: "Empresa deixada de seguir com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deixar de seguir." });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const companyId = req.companyId;
    const followers = await Follow.findAll({
      where: { companyId },
      attributes: ["userId"],
    });
    res.json({ followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar seguidores." });
  }
};
