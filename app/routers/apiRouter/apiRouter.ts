import { questions, questionsSchema, getById, getByIdSchema, categories, categoriesSchema, languages, languagesSchema } from "@app/handlers";
import { addRepoPlugin } from "@app/server/plugins";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

  app.register(addRepoPlugin);

  app.get("/questions/:id", { schema: getByIdSchema("question") }, getById);
  app.get("/categories/:id", { schema: getByIdSchema("category") }, getById);
  app.get("/languages/:id", { schema: getByIdSchema("language") }, getById);

  app.get("/questions", { schema: questionsSchema }, questions);

  app.get("/categories", { schema: categoriesSchema }, categories);

  app.get("/languages", { schema: languagesSchema }, languages);

  next();
};

