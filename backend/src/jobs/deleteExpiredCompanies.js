import Company from "../models/Company.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
export const deleteExpiredCompanies = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const expired = await Company.findAll({
            where: {
                deletionScheduledAt: { [Op.lte]: twentyFourHoursAgo },
                deletedAt: null,
            },
        });

        for (const company of expired) {
            await company.update({ deletedAt: new Date() });

            console.log(`Conta ${company.companyName} excluída permanentemente`);
        }
    } catch (err) {
        console.error("Erro no cron de exclusão:", err);
    }
};

setInterval(deleteExpiredCompanies, 5 * 60 * 1000);
deleteExpiredCompanies();