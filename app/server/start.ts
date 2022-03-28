import { fastify } from "fastify";
import { fastifySwagger } from "fastify-swagger";
import { Sequelize } from "sequelize";
import { HotLogger } from "hot-utils";
import { apiRouter, apiRouterAuth, serviceRouter } from "@app/routers";
import { addSequelizePlugin, addLoggerPlugin } from "./plugins";
import { swagDocs } from "./swagger";
import { SERVER_PORT } from "@app/constants";
import { v4 } from "uuid";

export const startServer = async (logger: HotLogger, sq: Sequelize | undefined) => {
  const app = fastify({
    logger: false,
    requestIdLogLabel: "requestId",
    genReqId: () => v4()
  });

  app.register(addLoggerPlugin, { logger });
  app.register(fastifySwagger, swagDocs);
  app.register(addSequelizePlugin, { sq });
  app.register(apiRouter, { prefix: "api" });
  app.register(apiRouterAuth, { prefix: "api" });
  app.register(serviceRouter, { prefix: "service" });

  app.ready(err => {
    if (err) {
      app.logger.error("Error on app ready", { err });
    }

    app.swagger();
  });

  try {
    app.listen(SERVER_PORT, "0.0.0.0", () => {
      app.logger.info("Service started", { port: SERVER_PORT });
    });
  } catch (err) {
    app.logger.error("Error starting server", { err: <Error>err, port: SERVER_PORT });
    process.exit(1);
  }

  return app;
};
