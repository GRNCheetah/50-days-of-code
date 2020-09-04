import { Client } from "discord.js";
import { ParsedMessage } from "discord-command-parser";
import { logBot } from "../logging_config";
import { isAuthenticated } from "../authenticators";
import { validateScream } from "../validators";


async function cmdNextQuestion(parsed: ParsedMessage, client: Client) {
  isAuthenticated(parsed, "officer");
  // TODO - Create Next Question validation
  validateScream(parsed);

  logBot.debug("Display next question.");
}

export { cmdNextQuestion };
