/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from "fastify";
import { QuestionsRepo } from "@db/repositories";
import { RouteGenericInterface } from "fastify/types/route";
import { Server, IncomingMessage, ServerResponse } from "http";

export const questions = async (
  req: FastifyRequest<{ Querystring: { amount?: number; languageId?: number; categoryId?: number } }, Server, IncomingMessage, unknown>,
  _reply: FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
) => {
  const { amount, languageId, categoryId } = req.query || {};
  const questions = await QuestionsRepo.getRandom({
    requestId: req.id,
    where: {
      ...languageId && { languageId },
      ...categoryId && { categoryId }
    },
    ...amount && { amount }
  });

  return questions;
};