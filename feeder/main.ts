import { HotLogger } from "hot-utils";
import { feedQuestions } from "./feedQuestions";

const log = HotLogger.createLogger("trivia-art/feeder");

class TriviaFeed {
  private _interval: NodeJS.Timer | undefined;

  get isRunning() {
    return !!this._interval;
  }

  public start = () => {
    log.info("Starting trivia-art feeder");
    this._interval = setInterval(feedQuestions, 7000);
  };

  public stop = () => {
    log.info("Stopping trivia-art feeder");
    if (this._interval) {
      clearInterval(this._interval);
    }
  };

}

export const TriviaFeeder = new TriviaFeed();