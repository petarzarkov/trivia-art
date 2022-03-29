import { withError } from "@contracts/APIResults";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { HotLogger } from "hot-utils";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    logger: HotLogger;
  }
  export interface FastifyRequest {
    logger: HotLogger;
  }
}

const parseRequestLog = (request: FastifyRequest) => ({
  method: request.method,
  url: request.url,
  path: request.routerPath,
  parameters: request.params,
  body: request.body,
  query: request.query
});

const addLogger: FastifyPluginAsync<{ logger: HotLogger }> = async (
  fastify,
  options
) => {
  fastify.decorate("logger", options.logger);

  fastify.addHook("onRequest", (request, _reply, done) => {
    request.logger = options.logger;
    fastify.logger.info(`Received ${request.method} request`, {
      requestId: request.id,
      event: `${request.method}${request.url}`,
      request: parseRequestLog(request)
    });
    done();
  });

  fastify.addHook("onSend", (request, reply, payload: Record<string, unknown>, done) => {
    fastify.logger.info(`Sending ${request.method} response`, {
      requestId: request.id,
      event: `${request.method}${request.url}`,
      responseTime: reply.getResponseTime(),
      request: parseRequestLog(request),
      response: {
        payload
      }
    });

    done();
  });

  fastify.addHook("onResponse", (request, reply, done) => {
    fastify.logger.info(`Sent ${request.method} response`, {
      requestId: request.id,
      event: `${request.method}${request.url}`,
      responseTime: reply.getResponseTime(),
      request: parseRequestLog(request),
      response: {
        statusCode: reply.statusCode,
        statusMessage: reply.raw.statusMessage,
        sent: reply.sent,
      }
    });

    done();
  });

  fastify.setErrorHandler((error, req, reply) => {
    if (error.validation) {
      fastify.logger.error(`Validation error on ${req.method} request`, {
        err: error,
        requestId: req.id,
        event: `${req.method}${req.url}`,
        request: parseRequestLog(req)
      });
      reply.status(400).send(withError(error.message));
      return;
    }

    reply.send(error);
  });

  fastify.addHook("onError", (request, reply, error, done) => {
    fastify.logger.error(`Error on ${request.method} request`, {
      err: error,
      requestId: request.id,
      event: `${request.method}${request.url}`,
      responseTime: reply.getResponseTime(),
      request: parseRequestLog(request)
    });
    done();
  });

};

export const addLoggerPlugin = fp(addLogger);