import { API_TOKEN } from "@app/constants";
import { CategoriesRepo, QuestionsRepo, LangRepo } from "@db/repositories";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

type Repo = typeof CategoriesRepo | typeof QuestionsRepo | typeof LangRepo;

// Declaration merging
declare module "fastify" {
  export interface FastifyRequest {
    repo?: Repo;
  }
}

const repos = {
  questions: QuestionsRepo,
  languages: LangRepo,
  categories: CategoriesRepo
};

const reposKeys = Object.keys(repos);

const addRepo: FastifyPluginAsync = async (
  fastify
) => {

  fastify.addHook("preHandler", (request, reply, next) => {
    const { apitoken } = request.headers;
    if (apitoken && apitoken !== API_TOKEN) {
      reply.status(401);
      next(new Error("Unauthorized request."));
    }

    const keyLookup = reposKeys.find(key => (request.raw.url || "").includes(key));
    if (keyLookup) {
      request.repo = repos[keyLookup as keyof typeof repos];
    }

    next();
  });

};

export const addRepoPlugin = fp(addRepo);