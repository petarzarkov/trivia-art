import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { HotLogger } from "hot-utils";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    logger: HotLogger;
  }
}

const addLogger: FastifyPluginAsync<{ logger: HotLogger }> = async (
  fastify,
  options
) => {
  fastify.decorate("logger", options.logger);
};

export const addLoggerPlugin = fp(addLogger);