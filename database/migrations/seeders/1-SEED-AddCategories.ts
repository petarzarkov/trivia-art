import SequelizeType, { QueryInterface } from "sequelize";

const baseCategories = [{ category: "GeneralKnowledge", previewName: "General Knowledge" }];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tblCategories", baseCategories, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete("tblCategories", { category: { [Sequelize.Op.in]: baseCategories.map(r => r.category) } });
  }
};
