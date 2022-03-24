/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { QuestionsRepo } from "@db/repositories";
import { RouteGenericInterface } from "fastify/types/route";
import { Server, IncomingMessage, ServerResponse } from "http";

export const questions = async (
  _req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown>,
  _reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
) => {
  const questions = await QuestionsRepo.getRandom();

  return { questions };
};