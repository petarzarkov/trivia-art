import { questions, questionsSchema, categories, categoriesSchema, languages, languagesSchema } from "@app/handlers";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

  app.get("/questions", { schema: questionsSchema }, questions);

  app.get("/categories", { schema: categoriesSchema }, categories);

  app.get("/languages", { schema: languagesSchema }, languages);

  next();
};

