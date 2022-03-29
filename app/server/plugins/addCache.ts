import { Cache } from "@app/redis";
import { CategoriesDTO, CategoriesRepo, LangRepo, LanguagesDTO } from "@db/repositories";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

// Declaration merging
declare module "fastify" {
  export interface FastifyRequest {
    caches?: {
      languages: Cache<LanguagesDTO>;
      categories: Cache<CategoriesDTO>;
    };
    cache?: Cache<LanguagesDTO> | Cache<CategoriesDTO>;
  }
}

const addCache: FastifyPluginAsync = async (
  fastify
) => {
  if (fastify.redis) {
    const caches = {
      languages: new Cache({
        name: "LanguagesCache",
        redis: fastify.redis,
        getAll: () => LangRepo.getAll().then(r => r.isSuccess && r.result?.length ? r.result : undefined)
      }),
      categories: new Cache({
        name: "CategoriesCache",
        redis: fastify.redis,
        getAll: () => CategoriesRepo.getAll().then(r => r.isSuccess && r.result?.length ? r.result : undefined)
      })
    };

    caches.categories.init();
    caches.languages.init();
    const cacheKeys = Object.keys(caches) as unknown as (keyof typeof caches)[];

    fastify.addHook("preHandler", (request, _reply, next) => {
      const keyLookup = cacheKeys.find(key => (request.raw.url || "").includes(key));
      if (keyLookup) {
        request.caches = caches;
        request.cache = caches[keyLookup];
      }

      next();
    });
  }

};

export const addCachePlugin = fp(addCache);