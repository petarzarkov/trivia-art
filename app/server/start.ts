import { fastify } from "fastify";
import { Sequelize } from "sequelize";
import { HotLogger } from "hot-utils";
import { apiRouter, serviceRouter } from "@app/routers";
import { addSequelizePlugin, addLoggerPlugin } from "./plugins";

const log = HotLogger.createLogger("server");

export const startServer = async (sq: Sequelize | undefined) => {
  const app = fastify({ logger: true });

  app.register(addLoggerPlugin, { logger: log });
  app.register(addSequelizePlugin, { sq });
  app.register(serviceRouter);
  app.register(apiRouter, { prefix: "api" });

  try {
    app.listen(3000, () => {
      log.info("Service started", { port: 3000 });
    });
  } catch (err) {
    log.error("Error starting server", { err: <Error>err, port: 3000 });
    process.exit(1);
  }

  return app;
};
