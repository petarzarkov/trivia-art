import { fastify } from "fastify";
import { fastifySwagger } from "fastify-swagger";
import { Sequelize } from "sequelize";
import { HotLogger } from "hot-utils";
import { apiRouter, serviceRouter } from "@app/routers";
import { addSequelizePlugin, addLoggerPlugin } from "./plugins";
import { swagDocs } from "./swagger";
import { SERVER_PORT } from "@app/constants";
import { withError } from "@contracts/APIResults";

const log = HotLogger.createLogger("server");

export const startServer = async (sq: Sequelize | undefined) => {
  const app = fastify({
    logger: true,
    requestIdLogLabel: "requestId",
  });

  app.setErrorHandler((error, _req, reply) => {
    if (error.validation) {
      reply.status(400).send(withError(error.message));
      return;
    }

    reply.send(error);
  });

  app.register(addLoggerPlugin, { logger: log });
  app.register(serviceRouter);
  app.register(fastifySwagger, swagDocs);
  app.register(addSequelizePlugin, { sq });
  app.register(apiRouter, { prefix: "api" });

  app.ready(err => {
    if (err) {
      app.logger.error("App Error", { err });
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
