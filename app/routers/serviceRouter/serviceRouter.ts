import { QuestionsRepo } from "@db/repositories";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const serviceRouter = (server: FastifyInstance, _options: FastifyPluginOptions, done: (err?: Error | undefined) => void) => {

  server.get("/_upcheck", async (_req, reply) => {
    reply.status(200);
    return {
      up: true
    };
  });

  server.get("/_healthcheck", async () => {
    const dbCheck = await QuestionsRepo.getAll();

    return ({
      healthy: dbCheck.isSuccess,
    });
  });

  done();
};

