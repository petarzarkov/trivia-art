import { HotLogger } from "hot-utils";
import { feedQuestions } from "./feedQuestions";

const log = HotLogger.createLogger("trivia-art/feeder");

export const startFeed = () => {
  log.info("Starting trivia-art feeder");
  setInterval(feedQuestions, 7000);
};
