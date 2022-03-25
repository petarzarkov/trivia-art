/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { CategoriesRepo } from "@db/repositories";
import { RouteGenericInterface } from "fastify/types/route";
import { Server, IncomingMessage, ServerResponse } from "http";

export const categories = async (
  req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
  _reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
) => {
  const categories = await CategoriesRepo.getAll({ requestId: req.id });

  return categories;
};