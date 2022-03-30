import SequelizeType, { QueryInterface } from "sequelize";

const baseLangs = [{ lang: "en", previewName: "English" }];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tblLanguages", baseLangs, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete("tblLanguages", { lang: { [Sequelize.Op.in]: baseLangs.map(r => r.lang) } });
  }
};
