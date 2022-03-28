import { Options, Dialect } from "sequelize";

export const getOptions = (): Options => ({
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "trivia-art",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5445,
  dialect: process.env.DB_DIALECT as Dialect || "postgres",
  ...process.env.NODE_ENV === "production" && {
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }

});