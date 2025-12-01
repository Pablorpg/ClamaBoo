import Follow from "../models/Follow.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const followCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    const already = await Follow.findOne({ where: { userId, companyId } });
    if (already) {
      return res.status(400).json({ message: "Já está seguindo" });
    }

    await Follow.create({ userId, companyId });
    res.json({ message: "Seguindo com sucesso!", following: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unfollowCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    await Follow.destroy({ where: { userId, companyId } });
    res.json({ message: "Deixou de seguir", following: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkFollowing = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    const follow = await Follow.findOne({ where: { userId, companyId } });
    res.json({ following: !!follow });
  } catch (err) {
    res.status(500).json({ following: false });
  }
};

export const getFollowersCount = async (req, res) => {
  try {
    const companyId = req.params.id;
    const count = await Follow.count({ where: { companyId } });
    res.json({ followersCount: count });
  } catch (err) {
    res.json({ followersCount: 0 });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: [{
        model: Company,
        as: "following",
        attributes: ["id", "companyName", "profileImage", "about"]
      }]
    });

    res.json({ following: user.following });
  } catch (err) {
    console.error("Erro em getFollowing:", err);
    res.status(500).json({ following: [] });
  }
};
