import { questionSchema } from "@app/handlers";
import { categorySchema } from "@app/handlers/categories";
import { languageSchema } from "@app/handlers/languages";
import { generalErrors } from "@app/server/swagger/generalErrors";
import { FastifySchema } from "fastify";

const getItemSchemaPerType = (type: string) => {
  switch (type) {
    case "question":
      return questionSchema;
    case "language":
      return languageSchema;
    case "category":
      return categorySchema;
    default: {
      return {
        type: "object",
        nullable: true
      };
    }
  }
};

export const getByIdSchema = (type: string): FastifySchema & Record<string, unknown> => ({
  description: `Get ${type} by id`,
  tags: [type],
  summary: `Get ${type} by id`,
  params: {
    type: "object",
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: { type: "number" }
    }
  },
  response: {
    "2xx": {
      description: "Successful response",
      type: "object",
      properties: {
        isSuccess: { type: "boolean" },
        result: getItemSchemaPerType(type),
      }
    },
    ...generalErrors
  },
  security: [
    {
      "apiKey": []
    }
  ]
});