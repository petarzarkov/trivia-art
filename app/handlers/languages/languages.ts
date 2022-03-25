/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { LangRepo } from "@db/repositories";
import { RouteGenericInterface } from "fastify/types/route";
import { Server, IncomingMessage, ServerResponse } from "http";

export const languages = async (
  req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
  _reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
) => {
  const languages = await LangRepo.getAll({ requestId: req.id });
  return languages;
};