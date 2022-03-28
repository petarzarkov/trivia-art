
import { API_TOKEN } from "@app/constants";
import { FeedsMgr } from "@feeder/FeederManager";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const serviceRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

  app.get("/upcheck", {
    schema: {
      tags: ["service"]
    }
  }, async (_, reply) => {
    reply.status(200);
    return {
      up: true
    };
  });

  app.get("/healthcheck", {
    schema: {
      tags: ["service"]
    }
  }, async (_, reply) => {
    try {
      await app.sq?.authenticate();

      return {
        healthy: true
      };
    } catch (error) {
      reply.status(500);
      app.logger.error("Error on healthcheck", { err: <Error>error });

      return {
        healthy: false
      };
    }
  });

  app.get("/feeds", {
    schema: {
      tags: ["service"],
      security: [
        {
          "apitoken": []
        }
      ]
    },
    preHandler: (request, reply, done) => {
      const { apitoken } = request.headers;
      if (apitoken !== API_TOKEN) {
        reply.status(401);
        done(new Error("Unauthorized request."));
      }

      done();
    },
    handler: async () => {
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
    }

  });

  next();
};

