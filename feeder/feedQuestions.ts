import { CategoriesRepo, QuestionsRepo } from "@db/repositories";
import { HotRequests, HotLogger } from "hot-utils";
import { decodeHtml } from "./utils";

const log = HotLogger.createLogger("trivia-art/feedQuestions");

export type QuestionRaw = {
  question: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const feedQuestion = async () => {
  return HotRequests.get<Record<string, unknown>, { results?: QuestionRaw[] | undefined }>({
    url: "https://opentdb.com/api.php?amount=50",
    options: {
      logger: log
    }
  }).then(async r => {
    if (r.success && r.result?.results?.length) {
      const openQs: QuestionRaw[] = r.result.results.map(rr => ({
        ...rr,
        question: decodeHtml(rr.question),
        correct_answer: decodeHtml(rr.correct_answer),
        incorrect_answers: rr.incorrect_answers.map(decodeHtml)
      }));

      for (const question of openQs) {
        const hasQuestion = await QuestionsRepo.findOne({ where: { question: question.question } });
        if (hasQuestion.isSuccess && hasQuestion.result) {
          continue;
        }

        let categoryId: number | undefined;
        if (question.category) {
          const hasCategory = await CategoriesRepo.findOne({ where: { category: question.category } });
          if (hasCategory.isSuccess) {
            if (!hasCategory.result) {
              const d = await CategoriesRepo.create({ dto: { category: question.category, languageId: 1, previewName: question.category } });
              categoryId = d.isSuccess && d.result?.id || 1;
            } else {
              categoryId = hasCategory.result.id;
            }
          }
        }

        await QuestionsRepo.create({
          dto: {
            categoryId: categoryId || 1,
            correctAnswer: question.correct_answer,
            incorrectAnswers: question.incorrect_answers,
            difficulty: question.difficulty,
            languageId: 1,
            question: question.question
          }
        });
      }
    }
  });
};

export const feedQuestions = (n = 3) => {
  const promises = [...Array(n).keys()].map(feedQuestion);

  return Promise.allSettled(promises);
};