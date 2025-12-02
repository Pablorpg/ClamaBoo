import Follow from "../models/Follow.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

/**
 * Seguir empresa
 */
export const followCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Não autorizado" });

    const company = await Company.findByPk(companyId);
    if (!company)
      return res.status(404).json({ message: "Empresa não encontrada" });

    const already = await Follow.findOne({ where: { userId, companyId } });
    if (already) {
      return res.status(400).json({ message: "Você já segue esta empresa" });
    }

    await Follow.create({ userId, companyId });
    res.json({ message: "Agora você está seguindo esta empresa!", following: true });

  } catch (err) {
    console.error("Erro followCompany:", err);
    res.status(500).json({ message: "Erro ao seguir a empresa" });
  }
};

/**
 * Deixar de seguir empresa
 */
export const unfollowCompany = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Não autorizado" });

    const company = await Company.findByPk(companyId);
    if (!company)
      return res.status(404).json({ message: "Empresa não encontrada" });

    await Follow.destroy({ where: { userId, companyId } });

    res.json({ message: "Você deixou de seguir a empresa", following: false });

  } catch (err) {
    console.error("Erro unfollowCompany:", err);
    res.status(500).json({ message: "Erro ao deixar de seguir" });
  }
};

/**
 * Verifica se o usuário segue a empresa
 */
export const checkFollowing = async (req, res) => {
  try {
    const userId = req.userId;
    const companyId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Não autorizado" });

    const follow = await Follow.findOne({ where: { userId, companyId } });

    res.json({ following: !!follow });

  } catch (err) {
    console.error("Erro checkFollowing:", err);
    res.status(500).json({ following: false, message: "Erro ao verificar follow" });
  }
};

/**
 * Contar seguidores de uma empresa
 */
export const getFollowersCount = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findByPk(companyId);
    if (!company)
      return res.status(404).json({ message: "Empresa não encontrada" });

    const count = await Follow.count({ where: { companyId } });

    res.json({ followersCount: count });

  } catch (err) {
    console.error("Erro getFollowersCount:", err);
    res.status(500).json({ message: "Erro ao contar seguidores", followersCount: 0 });
  }
};

/**
 * Lista empresas que o usuário segue
 */
export const getFollowing = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Não autorizado" });

    const user = await User.findByPk(userId, {
      include: [{
        model: Company,
        as: "following",
        attributes: ["id", "companyName", "profileImage", "about"]
      }]
    });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({ following: user.following });

  } catch (err) {
    console.error("Erro getFollowing:", err);
    res.status(500).json({ following: [], message: "Erro ao buscar lista de seguindo" });
  }
};
