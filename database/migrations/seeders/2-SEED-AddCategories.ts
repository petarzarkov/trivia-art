import SequelizeType, { QueryInterface } from "sequelize";

const baseCategories = [
  {
    id: 1,
    category: "GeneralKnowledge",
    previewName: "General Knowledge"
  },
  {
    id: 2,
    category: "Celebrities",
    previewName: "Celebrities"
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tblCategories", baseCategories, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete("tblCategories", { category: { [Sequelize.Op.in]: baseCategories.map(r => r.category) } });
  }
};
