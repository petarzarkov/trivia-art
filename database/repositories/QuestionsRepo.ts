import { TblQuestions } from "@db/models";
import { BaseRepository } from "./BaseRepository";
import { ModelToDTO } from "@db/ModelToDTO";
import { Attributes, WhereOptions, literal } from "sequelize";

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

class QuestionsRepository extends BaseRepository<TblQuestions, QuestionsDTO> {
  constructor() {
    super({
      table: TblQuestions,
      mapTableToDTO,
    });
  }

  public getRandom = async ({ where, requestId, amount = 50 }: { amount?: number; where?: WhereOptions<QuestionsDTO>; requestId?: string } = {}) => {
    return this.commit<QuestionsDTO[] | null>({
      requestId,
      command: () => this.table.findAll({
        where: where as unknown as WhereOptions<Attributes<TblQuestions>>,
        order: literal("random()"),
        limit: amount
      }).then(e => e.length ? e?.map(this.mapTableToDTO) : null)
    });
  };
}

export const QuestionsRepo = new QuestionsRepository();

