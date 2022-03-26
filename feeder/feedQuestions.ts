import { CategoriesDTO, CategoriesRepo, QuestionsRepo } from "@db/repositories";
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

const getQuestions = async () => {
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
      const categories = openQs.map(r => r.category);

      return {
        categories,
        questions: openQs
      };
    }
  });
};

const processQuestions = async ({ categories, questions }:{
  categories: string[];
  questions: QuestionRaw[];
}) => {
  const currCategories = await CategoriesRepo.getAll();
  if (!currCategories.isSuccess || !currCategories?.result?.length) {
    return;
  }

  const foundCategories = currCategories.result.map(cat => cat.category);
  const categoriesToAdd = categories.reduce((prev, curr) => {
    if (!prev.includes(curr) || !foundCategories.includes(curr)) {
      prev.push(curr);
    }

    return prev;
  }, [] as string[]);

  let addedCategories: CategoriesDTO[] | null | undefined = [];
  if (categoriesToAdd.length) {
    const createdCats = await CategoriesRepo.createBulk({
      dtos: categoriesToAdd.map(ca => ({
        category: ca,
        previewName: ca,
        languageId: 1
      }))
    });

    if (!createdCats.isSuccess) {
      return;
    }
    addedCategories = createdCats.result;
  }

  const allCategories: CategoriesDTO[] = addedCategories?.length ? [ ...currCategories.result, ...addedCategories] : [ ...currCategories.result];
  const createdQuestions = await QuestionsRepo.createBulk({
    dtos: questions.map(question => ({
      categoryId: allCategories.find(c => c.category === question.category)?.id || 1,
      correctAnswer: question.correct_answer,
      incorrectAnswers: question.incorrect_answers,
      difficulty: question.difficulty,
      languageId: 1,
      question: question.question
    }))
  });

  return {
    allCategories,
    createdQuestions
  };
};

const feed = async () => {
  const newQ = await getQuestions();

  if (newQ?.categories?.length && newQ?.questions?.length) {
    return processQuestions({
      categories: newQ.categories,
      questions: newQ.questions
    });
  }
};

export const feedQuestions = (n = 3) => {
  const promises = [...Array(n).keys()].map(feed);

  return Promise.allSettled(promises);
};
