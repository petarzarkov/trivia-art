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

  fastify.addHook("preHandler", (request, _reply, next) => {
    const keyLookupRepo = reposKeys.find(key => (request.raw.url || "").includes(key));
    if (keyLookupRepo) {
      request.repo = repos[keyLookupRepo as keyof typeof repos];
    }

    next();
  });

};

export const addRepoPlugin = fp(addRepo);