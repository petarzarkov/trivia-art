import { fastify } from "fastify";
import { HotLogger } from "hot-utils";
import { apiRouter, serviceRouter } from "@app/routers";

const log = HotLogger.createLogger("server/request-response");

export const startServer = async () => {
  const app = fastify({ logger: true });

  app.register(serviceRouter);
  app.register(apiRouter, { prefix: "api" });

  try {
    app.listen(3000, () => {
      log.info("Service started", { port: 3000 });
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
};
