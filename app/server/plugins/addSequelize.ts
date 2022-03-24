import { FastifyPluginAsync } from "fastify";
import { Sequelize } from "sequelize";
import fp from "fastify-plugin";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    sq: Sequelize | undefined;
  }
}

const addSequelize: FastifyPluginAsync<{ sq: Sequelize | undefined }> = async (
  fastify,
  options
) => {
  fastify.decorate("sq", options.sq);
};

export const addSequelizePlugin = fp(addSequelize);