import { APP_VERSION, isProd } from "@app/constants";
import { SwaggerOptions } from "fastify-swagger";
import { generalError } from "./generalErrors";

export const swagDocs: SwaggerOptions = {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Trivia API swagger",
      description: "Trivia API explained",
      version: APP_VERSION,
    },
    externalDocs: {
      url: "https://github.com/petarzarkov/trivia-art",
      description: "Find more info here"
    },
    schemes: [isProd ? "https" : "http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "Service", description: "Service related end-points" },
    ],
    securityDefinitions: {
      apitoken: {
        type: "apiKey",
        name: "apitoken",
        in: "header",
        description: "API token required in headers"
      }
    },
    definitions: {
      "GeneralError": generalError
    },
  },
  uiConfig: {
    docExpansion: "list",
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (_request, _reply, next) {
      next();
    },
    preHandler: function (_request, _reply, next) {
      next();
    }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
};