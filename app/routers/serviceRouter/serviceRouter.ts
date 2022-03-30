
import { API_TOKEN, APP_VERSION } from "@app/constants";
import { FeedsMgr } from "@app/feeder";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { Server, IncomingMessage } from "http";

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
      const pong = await app.redis?.ping();

      return {
        version: APP_VERSION,
        dbHealthy: true,
        redisHealthy: pong === "PONG"
      };
    } catch (error) {
      reply.status(500);
      app.logger.error("Error on healthcheck", { err: <Error>error });

      return {
        healthy: false
      };
    }
  });

  app.post("/feeds", {
    schema: {
      tags: ["service"],
      body: {
        type: "object",
        required: ["action"],
        properties: {
          action: { type: "string", enum: ["start", "stop"] },
        }
      },
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
    handler: async (req: FastifyRequest<{ Body: { action: "start" | "stop" } }, Server, IncomingMessage, unknown>) => {
      if (req.body.action === "stop") {
        FeedsMgr.stopAll();

        return {
          running: false
        };
      }

      if (!FeedsMgr.areRunning) {
        FeedsMgr.startAll();
      }

      return {
        running: true
      };
    }

  });

  next();
};

