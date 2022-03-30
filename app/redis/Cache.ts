import { CACHE_REFRESH_INTERVAL } from "@app/constants";
import { IErrorResult, ISuccessResult, withError, withResult } from "@contracts/APIResults";
import { HotLogger } from "hot-utils";
import Redis from "ioredis";

const log = HotLogger.createLogger("@trivia-art/cache");

export class Cache<T, R = T> {
  protected isInitialized: boolean;
  private redis: Redis;
  private interval: NodeJS.Timeout;
  private refreshInterval: number;
  private getAll: () => Promise<T[] | undefined>;
  name: string;

  constructor({ name, redis, getAll, refreshInterval = CACHE_REFRESH_INTERVAL }:
  { name: string; redis: Redis; getAll: () => Promise<T[] | undefined>; refreshInterval?: number }) {
    this.name = name;
    this.isInitialized = false;
    this.redis = redis;
    this.getAll = getAll;
    this.refreshInterval = refreshInterval;
  }

  public get isCacheInitialized(): boolean {
    return !!this.isInitialized;
  }

  private setCacheData = async (dataRes: T[]) => {
    const cache = dataRes.reduce((acc: Record<string, string>, rec: T, index: number) => {
      acc[(rec as unknown as { id?: string })?.id || index + 1] = JSON.stringify(<R>(<unknown>rec));
      return acc;
    }, {});
    await this.redis.hmset(this.name, cache);
  };

  public getCache = async ({ requestId }: { requestId?: string }): Promise<ISuccessResult<T[]> | IErrorResult> => {
    const cache = await this.redis.hgetall(this.name);
    try {
      return withResult(Object.keys(cache).map((key) => JSON.parse(cache[key])) || []);
    } catch (error) {
      log.error(`Error on ${this.name}`, { err: <Error>error, requestId });
      return withError(error);
    }
  };

  public getById = async ({ id, requestId }: { id: string; requestId?: string }): Promise<ISuccessResult<T> | IErrorResult> => {
    const byId = await this.redis.hget(this.name, id.toString());
    try {
      return withResult(byId ? JSON.parse(byId) : undefined);
    } catch (error) {
      log.error(`Error on ${this.name}.getById`, { err: <Error>error, requestId });
      return withError(error);
    }
  };

  public count = async ({ requestId }: { requestId?: string }): Promise<ISuccessResult<number> | IErrorResult> => {
    const count = await this.redis.hlen(this.name);
    try {
      return withResult(count);
    } catch (error) {
      log.error(`Error on ${this.name}.count`, { err: <Error>error, requestId });
      return withError(error);
    }
  };

  public findOne = async <Key extends keyof R>(properties: Partial<Record<Key, R[Key]>>): Promise<T | undefined> => {
    const cache = await this.redis.hgetall(this.name);
    const res = Object.keys(cache).find((key) => {
      for (const propKey of Object.keys(properties)) {
        const propKeyCast = propKey as Key;
        const property = properties[propKeyCast];
        const val = JSON.parse(cache[key]);
        if (property instanceof Array) {
          if (property.indexOf(val[propKeyCast]) < 0) {
            return false;
          }
          continue;
        }
        if (val[propKeyCast] !== property) {
          return false;
        }
      }
      return true;
    });

    return res ? JSON.parse(cache[res]) : undefined;
  };

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    log.info(`Starting ${this.name} cache interval`, { refreshInterval: this.refreshInterval });
    await this.fetchCache();
    this.isInitialized = true;
    this.startRefreshInterval();
  }

  public async flushCache(): Promise<void> {
    await this.fetchCache();
  }

  public stop() {
    if (!this.interval) return;
    clearInterval(this.interval);
  }

  protected startRefreshInterval() {
    this.interval = setInterval(async () => {
      try {
        await this.fetchCache();
      } catch (error) {
        log.error("Unable to update cache", { err: <Error>error, cache: this.name });
      }
    }, this.refreshInterval);
  }

  protected async fetchCache() {
    const dbResult = await this.getAll();
    if (!dbResult || !dbResult.length) {
      log.warn(`Missing data for cache ${this.name}`);
      return;
    }

    await this.setCacheData(dbResult);
  }

}
