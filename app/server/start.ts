import { fastify } from "fastify";
import { fastifySwagger } from "fastify-swagger";
import { Sequelize } from "sequelize";
import { HotLogger } from "hot-utils";
import { apiRouter, serviceRouter } from "@app/routers";
import { addSequelizePlugin, addLoggerPlugin } from "./plugins";
import { swagDocs } from "./swagger";
import { SERVER_PORT } from "@app/constants";
import { v4 } from "uuid";

const log = HotLogger.createLogger("@trivia-art/server");

export const startServer = async (sq: Sequelize | undefined) => {
  const app = fastify({
    logger: false,
    requestIdLogLabel: "requestId",
    genReqId: () => v4()
  });

  app.register(addLoggerPlugin, { logger: log });
  app.register(serviceRouter);
  app.register(fastifySwagger, swagDocs);
  app.register(addSequelizePlugin, { sq });
  app.register(apiRouter, { prefix: "api" });

  app.ready(err => {
    if (err) {
      app.logger.error("Error on ready", { err });
    }

    app.swagger();
  });

  try {
    app.listen(SERVER_PORT, () => {
      log.info("Service started", { port: SERVER_PORT });
    });
  } catch (err) {
    log.error("Error starting server", { err: <Error>err, port: SERVER_PORT });
    process.exit(1);
  }

  return app;
};
