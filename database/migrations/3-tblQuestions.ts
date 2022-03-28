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
      question: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(1024)
      },
      difficulty: {
        defaultValue: "easy",
        allowNull: true,
        type: Sequelize.STRING(64)
      },
      correctAnswer: {
        allowNull: false,
        type: Sequelize.STRING(256)
      },
      incorrectAnswers: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      categoryId: {
        allowNull: true,
        defaultValue: 1,
        type: Sequelize.BIGINT,
        references: {
          model: "tblCategories",
          key: "id"
        },
        onDelete: "cascade"
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
    await queryInterface.dropTable("tblQuestions", { force: true });
  }
};