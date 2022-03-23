/* eslint-disable @typescript-eslint/no-unused-vars */
import { fastify } from "fastify";

const app = fastify({ logger: true });

// Declare a route
app.get("/", async () => {
  return { hello: "world" };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();