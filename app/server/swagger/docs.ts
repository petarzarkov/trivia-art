import { SwaggerOptions } from "fastify-swagger";

export const swagDocs: SwaggerOptions = {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Trivia API swagger",
      description: "Trivia API explained",
      version: "0.0.1"
    },
    externalDocs: {
      url: "https://github.com/petarzarkov/trivia-art",
      description: "Find more info here"
    },
    // host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "API", description: "API related end-points" },
    ],
    securityDefinitions: {
      apiKey: {
        type: "apiKey",
        name: "apiKey",
        in: "header"
      }
    },
    responses: {
      "BadRequest": {
        description: "Error response",
        schema: {
          $ref: "#/definitions/BadRequest"
        }
      },
      "NotFound": {
        description: "Not found response",
        schema: {
          $ref: "#/definitions/NotFound"
        }
      },
      "Error": {
        description: "Error response",
        schema: {
          $ref: "#/definitions/Error"
        }
      }
    },
    definitions: {
      "NotFound": {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", default: false },
          error: {
            type: "string",
            nullable: true,
          }
        }
      },
      "BadRequest": {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", default: false },
          error: {
            type: "string",
            nullable: true,
          }
        }
      },
      "Error": {
        type: "object",
        properties: {
          isSuccess: { type: "boolean", default: false },
          error: {
            type: "string",
            nullable: true,
          }
        }
      }
    }
  },
  uiConfig: {
    docExpansion: "full",
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
  exposeRoute: true
};