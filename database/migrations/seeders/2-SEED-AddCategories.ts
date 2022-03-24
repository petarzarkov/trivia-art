import SequelizeType, { QueryInterface } from "sequelize";

const baseCategories = [
  {
    category: "General Knowledge",
    previewName: "General Knowledge"
  },
  {
    category: "Celebrities",
    previewName: "Celebrities"
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tblCategories", baseCategories, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete(
      "tblCategories",
      { category: { [Sequelize.Op.in]: baseCategories.map(r => r.category) } });
  }
};
