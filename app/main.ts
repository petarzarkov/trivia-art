import { HotLogger } from "hot-utils";
import { connect } from "@db/connector";
import { startServer } from "@app/server";

const log = HotLogger.createLogger("trivia-art/main");

const main = async () => {
  const sequelizeInstance = await connect();
  await startServer(sequelizeInstance);
};

main().catch((err: Error) => {
  log.error("Exception raised while starting Trivia Art.", { err });
  setTimeout(() => process.exit(1), 1000);
});