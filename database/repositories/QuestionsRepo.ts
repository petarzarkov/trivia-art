import { TblCategories, TblLanguages, TblQuestions } from "@db/models";
import { BaseRepository } from "./BaseRepository";
import { ModelToDTO } from "@db/ModelToDTO";
import { Attributes, WhereOptions, literal } from "sequelize";
import { MIN_QUESTIONS } from "@app/constants";

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

  public getRandom = async ({ where, requestId, amount = MIN_QUESTIONS }: { amount?: number; where?: WhereOptions<QuestionsDTO>; requestId?: string } = {}) => {
    return this.commit<QuestionsDTO[] | null>({
      requestId,
      command: () => this.table.findAll({
        where: where as unknown as WhereOptions<Attributes<TblQuestions>>,
        order: literal("random()"),
        limit: amount
      }).then(e => e.length ? e?.map(this.mapTableToDTO) : null)
    });
  };

  // TODO
  public getRandomТ = async ({ where, requestId, amount = MIN_QUESTIONS }: { amount?: number; where?: WhereOptions<QuestionsDTO>; requestId?: string } = {}) => {
    return this.commit<QuestionsDTO[] | null>({
      requestId,
      command: () => this.table.findAll({
        where: where as unknown as WhereOptions<Attributes<TblQuestions>>,
        order: literal("random()"),
        limit: amount,
        include: [{ model: TblCategories, attributes: ["category"] }, { model: TblLanguages, attributes: ["lang"] }]
      }).then(e => e.length ? e?.map(r => ({
        ...this.mapTableToDTO(r),
        category: (r as unknown as { category?: string }).category,
        lang: (r as unknown as { lang?: string }).lang
      })) : null)
    });
  };
}

export const QuestionsRepo = new QuestionsRepository();

