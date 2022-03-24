import { TblQuestions } from "@db/models";
import { BaseRepository } from "./BaseRepository";
import { ModelToDTO } from "@db/ModelToDTO";

export type QuestionsDTO = ModelToDTO<TblQuestions>;

function mapTableToDTO(model: TblQuestions): QuestionsDTO {
  return {
    id: model.id,
    categoryId: model.categoryId,
    languageId: model.languageId,
    difficulty: model.difficulty,
    question: model.question,
    correctAnswer: model.correctAnswer,
    incorrectAnswers: model.incorrectAnswers,
  };
}

export const QuestionsRepo = new BaseRepository({
  table: TblQuestions,
  mapTableToDTO,
});
