import { CategoriesDTO, LanguagesDTO } from "@db/repositories";
import SequelizeType, { QueryInterface } from "sequelize";

const baseCategories: (Omit<CategoriesDTO, "id" | "languageId">)[] = [
  {
    category: "General Knowledge",
    previewName: "General Knowledge",
  },
  {
    category: "Celebrities",
    previewName: "Celebrities"
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    const languages = await queryInterface.sequelize.query<LanguagesDTO>("SELECT * from \"tblLanguages\"", { type: Sequelize.QueryTypes.SELECT });
    const cats = baseCategories.map(c => ({
      ...c,
      languageId: languages[0].id
    }));
    await queryInterface.bulkInsert("tblCategories", cats, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete(
      "tblCategories",
      { category: { [Sequelize.Op.in]: baseCategories.map(r => r.category) } });
  }
};
