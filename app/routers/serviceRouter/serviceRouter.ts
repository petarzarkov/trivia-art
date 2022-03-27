
import { FeedsMgr } from "@feeder/FeederManager";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const serviceRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

  app.get("/_upcheck", async (_, reply) => {
    reply.status(200);
    return {
      up: true
    };
  });

  app.get("/_healthcheck", async (_, reply) => {
    try {
      await app.sq?.authenticate();

      return {
        healthy: true
      };
    } catch (error) {
      reply.status(500);
      app.logger.error("Error on healthcheck", { err: <Error> error });

      return {
        healthy: false
      };
    }
  });

  app.get("/feeds", async () => {
    if (FeedsMgr.areRunning) {
      FeedsMgr.stopAll();

      return {
        running: false
      };
    }

    FeedsMgr.startAll();
    return {
      running: true
    };
  });

  next();
};

