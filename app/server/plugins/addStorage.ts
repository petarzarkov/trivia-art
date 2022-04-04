import { FastifyPluginAsync } from "fastify";
import { Sequelize } from "sequelize";
import Redis from "ioredis";
import fp from "fastify-plugin";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    sq: Sequelize | undefined;
    redis: Redis | undefined;
  }
  export interface FastifyRequest {
    sq: Sequelize | undefined;
    redis: Redis | undefined;
  }
}

const addStorage: FastifyPluginAsync<{ sq?: Sequelize; redis?: Redis }> = async (
  fastify,
  options
) => {
  fastify.decorate("sq", options.sq);
  fastify.decorate("redis", options.redis);

  fastify.addHook("preHandler", (request, _reply, next) => {
    request.sq = options.sq;
    request.redis = options.redis;

    next();
  });
};

export const addStoragePlugin = fp(addStorage);