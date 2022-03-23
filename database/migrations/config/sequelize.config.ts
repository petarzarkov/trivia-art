import { Options, Dialect } from "sequelize";

const env = process.env.NODE_ENV || "development";

const options: Options & Record<string, unknown> = {
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "trivia-art",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5445,
  dialect: process.env.DB_DIALECT as Dialect || "postgres",
  logging: true,
  migrationStorageTableName: "_migrations",
  seederStorage: "sequelize",
  seederStorageTableName: "_seeders"
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password, ...rest } = options;
console.log("DB Options", JSON.stringify({ ...rest }));

module.exports = {
  [env]: options
};
