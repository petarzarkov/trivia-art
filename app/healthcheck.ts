import { HotRequests } from "hot-utils";
import { isProd, SERVER_PORT } from "./constants";

export const startHealtcheck = async () => {
  const url = isProd ? "https://trivia-art.herokuapp.com" : `http://localhost:${SERVER_PORT}`;
  await HotRequests.get({ url: `${url}/service/healthcheck` });
  // Ping every 20 min
  setInterval(() => HotRequests.get({ url: `${url}/service/healthcheck` }), 20 * 60 * 1000);
};