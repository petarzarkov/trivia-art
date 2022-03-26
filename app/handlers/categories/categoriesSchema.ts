import { generalErrors } from "@app/server/swagger/generalErrors";
import { FastifySchema } from "fastify";

export const categoriesSchema: FastifySchema & Record<string, unknown> = {
  description: "Get categories",
  tags: ["API"],
  summary: "Categories",
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
            required: ["id", "category", "languageId"],
            properties: {
              id: { type: "number" },
              category: { type: "string" },
              previewName: { type: "string" },
              languageId: { type: "number" },
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