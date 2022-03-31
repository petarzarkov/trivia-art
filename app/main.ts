import { HotLogger } from "hot-utils";
import { connect } from "@db/connector";
import { startServer } from "@app/server";
import { connectRedis } from "./redis";
import { startHealtcheck } from "./healthcheck";

const log = HotLogger.createLogger("@trivia-art");

const main = async () => {
  const sequelizeInstance = await connect();
  const redisInstance = await connectRedis();
  await startServer(log, sequelizeInstance, redisInstance);
  void startHealtcheck();
};

main().catch((err: Error) => {
  log.error("Exception raised while starting Trivia Art.", { err });
  setTimeout(() => process.exit(1), 1000);
});