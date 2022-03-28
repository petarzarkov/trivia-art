import { API_TOKEN } from "@app/constants";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const addAuth: FastifyPluginAsync = async (
  fastify
) => {
  fastify.addHook("preHandler", (request, reply, next) => {
    const { apitoken } = request.headers;
    if (apitoken !== API_TOKEN) {
      reply.status(401);
      next(new Error("Unauthorized request."));
    }

    next();
  });

};

export const addAuthPlugin = fp(addAuth);