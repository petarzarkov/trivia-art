import { questions } from "@app/handlers";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiRouter = (server: FastifyInstance, _options: FastifyPluginOptions, done: (err?: Error | undefined) => void) => {

  server.get("/questions", {
    handler: questions
  });

  done();
};

