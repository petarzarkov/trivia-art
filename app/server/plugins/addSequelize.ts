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
}

const addSequelizeAndRedis: FastifyPluginAsync<{ sq?: Sequelize; redis?: Redis }> = async (
  fastify,
  options
) => {
  fastify.decorate("sq", options.sq);
  fastify.decorate("redis", options.redis);
};

export const addSqAndRedisPlugin = fp(addSequelizeAndRedis);