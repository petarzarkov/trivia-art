import SequelizeType, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.createTable("tblCategories", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.BIGINT
      },
      category: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(128)
      },
      previewName: {
        allowNull: true,
        defaultValue: "GeneralKnowledge",
        type: Sequelize.STRING(256)
      },
      languageId: {
        defaultValue: 1,
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: "tblLanguages",
          key: "id"
        }
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("tblCategories", { force: true });
  }
};
