import SequelizeType, { QueryInterface } from "sequelize";

const baseQuestions = [{
  categoryId: 2,
  difficulty: "medium",
  question: "What was the cause of death for Freddie Mercury?",
  correctAnswer: "Pneumonia",
  incorrectAnswers: [
    "Stomach Cancer",
    "HIV",
    "Brain Hemorrhage"
  ]
}];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("tblQuestions", baseQuestions, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof SequelizeType) => {
    await queryInterface.bulkDelete("tblQuestions", { question: { [Sequelize.Op.in]: baseQuestions.map(r => r.question) } });
  }
};
