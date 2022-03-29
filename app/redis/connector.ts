import { HotLogger } from "hot-utils";
import Redis from "ioredis";

const log = HotLogger.createLogger("@trivia-art/redis");

export const REDIS_URL: string = process.env.REDIS_URL || "redis://:triviadev@localhost:6336";

export const connectRedis = async () => {

  return new Promise<Redis>((resolve) => {
    const client = new Redis(REDIS_URL, {
      enableOfflineQueue: false,
      enableAutoPipelining: true,
      ...process.env.NODE_ENV === "production" && {
        tls: {
          rejectUnauthorized: false
        }
      }
    }).on("connect", () => {
      log.info("Redis connected", { status: client.status });
    }).on("ready", () => {
      log.info("Redis ready", { status: client.status });
      resolve(client);
    }).on("reconnecting", (nextReconnectTime: number) => {
      log.info("Redis reconnecting", { nextReconnectTime, status: client.status });
    }).on("error", (err) => {
      log.fatal("Unable to connect to Redis!", { err: <Error>err, status: client.status });
    }).on("close", () => {
      log.info("Redis close", { status: client.status });
    }).on("quit", () => {
      log.info("Exiting Redis...", { status: client.status });
    });
  }).catch(err => {
    log.fatal("Unable to connect to Redis!", { err: <Error>err });
    return undefined;
  });
};