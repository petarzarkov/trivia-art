import { generalErrors } from "@app/server/swagger/generalErrors";
import { FastifySchema } from "fastify";

export const languagesSchema: FastifySchema & Record<string, unknown> = {
  description: "Get languages",
  tags: ["API"],
  summary: "Languages",
  response: {
    "2xx": {
      description: "Successful response",
      type: "object",
      properties: {
        isSuccess: { type: "boolean" },
        result: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "lang"],
            properties: {
              id: { type: "number" },
              lang: { type: "string" },
              previewName: { type: "string" },
            }
          }
        },
      }
    },
    ...generalErrors
  },
  security: [
    {
      "apiKey": []
    }
  ]
};