import SequelizeType, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.createTable("tblQuestions", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT
      },
      categoryId: {
        allowNull: true,
        defaultValue: 1,
        type: Sequelize.INTEGER,
        references: {
          model: "tblCategories",
          key: "id"
        }
      },
      question: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(1024)
      },
      correctAnswer: {
        allowNull: false,
        type: Sequelize.STRING(256)
      },
      incorrectAnswers: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      language: {
        defaultValue: "en",
        allowNull: true,
        type: Sequelize.STRING(12)
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("tblCategories");
  }
};