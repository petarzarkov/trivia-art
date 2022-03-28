import {
  questions, questionsSchema, getById, getByIdSchema, categories, categoriesSchema,
  languages, languagesSchema, delByIdSchema, delById, bulkCreate, bulkCreateSchema
} from "@app/handlers";
import { addRepoPlugin } from "@app/server/plugins";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

  app.register(addRepoPlugin);

  app.get("/questions", { schema: questionsSchema }, questions);
  app.post("/questions", { schema: bulkCreateSchema("question") }, bulkCreate);

  app.get("/categories", { schema: categoriesSchema }, categories);
  app.post("/categories", { schema: bulkCreateSchema("category") }, bulkCreate);

  app.get("/languages", { schema: languagesSchema }, languages);
  app.post("/languages", { schema: bulkCreateSchema("language") }, bulkCreate);

  app.get("/questions/:id", { schema: getByIdSchema("question") }, getById);
  app.get("/categories/:id", { schema: getByIdSchema("category") }, getById);
  app.get("/languages/:id", { schema: getByIdSchema("language") }, getById);

  app.delete("/questions/:id", { schema: delByIdSchema("question") }, delById);
  app.delete("/categories/:id", { schema: delByIdSchema("category") }, delById);
  app.delete("/languages/:id", { schema: delByIdSchema("language") }, delById);

  next();
};

