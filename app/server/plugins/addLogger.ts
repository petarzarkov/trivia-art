import { withError } from "@contracts/APIResults";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { HotLogger } from "hot-utils";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
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
    fastify.logger.info(`Received ${request.method} request`, { requestId: request.id, request: parseRequestLog(request) });
    done();
  });

  fastify.addHook("onResponse", (request, reply, done) => {
    fastify.logger.info(`Completed ${request.method} request`, { requestId: request.id, responseTime: reply.getResponseTime(), request: parseRequestLog(request) });
    done();
  });

  fastify.setErrorHandler((error, req, reply) => {
    if (error.validation) {
      fastify.logger.error(`Validation error on ${req.method} request`, { err: error, requestId: req.id, request: parseRequestLog(req) });
      reply.status(400).send(withError(error.message));
      return;
    }

    fastify.logger.error(error.message, { err: error, requestId: req.id });
    reply.send(error);
  });

  fastify.addHook("onError", (request, reply, error, done) => {
    fastify.logger.error(`Error on ${request.method} request`, { err: error, requestId: request.id, responseTime: reply.getResponseTime() });
    done();
  });

};

export const addLoggerPlugin = fp(addLogger);