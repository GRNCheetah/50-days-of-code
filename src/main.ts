import Discord, { Message } from "discord.js";
import parser, { ParsedMessage } from "discord-command-parser";
import { AuthenticationError } from "./authenticators";
import { logBot } from "./logging_config";
import { ValidationError } from "./validators";
import {
  createTables,
  resetServerData
} from "./db_manager";

// Import commands from the commands/ folder
import { cmdHelp } from "./commands/help";
import { cmdNextQuestion } from "./commands/next_question";
import { cmdLeaderboard } from "./commands/leaderboard";

// Info on changing user's nick names
// https://stackoverflow.com/questions/41247353/change-user-nickname-with-discord-js
// setInterval() might be able to be used to delay a timed message
// Could also just add a command only officers could use to push the events

// Info on seperating out the commands, kind of works but feels a bit wonk
// Maybe just because im tired
// https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command

interface CONFIG {
  prefix: string;
  token: string;
}
const config: CONFIG = require("./config.json");

// Create the tables if they are gone
createTables();
// Empty all data from server_data table
resetServerData();
const client = new Discord.Client();

// Used to log when a user attempts to use a command that does not exist
function invalidCommand(parsed: ParsedMessage) {
  logBot.info(
    `An invalid command from ${parsed.message.author.username}, "${parsed.command}" was sent and rejected`
  );
}

// Used to log when a user attempts to use a command they are not allowed to use
function unauthenticatedCommand(parsed: ParsedMessage) {
  logBot.info(
    `User: "${parsed.message.author.username}" just tried to use command: "${parsed.command}".`
  );
}

client.on("ready", () => {
  logBot.info(() => `Logged in as ${client.user.tag}`);

  // Set prescense
  client.user.setActivity("Welcome | ?help");

});

client.on("message", async (message: Message) => {
  // ignore bots and self, and messages that dont start with prefix
  const parsed = parser.parse(message, config.prefix, {
    allowBots: false,
    allowSelf: false
  });
  // If parsing failed, back out
  if (!parsed.success) return;

  try {
    if (parsed.command === "leaderboard") {
      await cmdLeaderboard(parsed, client);
    } else if (parsed.command === "next") {
      await cmdNextQuestion(parsed, client);
    } else if (parsed.command === "help") {
      await cmdHelp(message);
    } else {
      message.reply(`${parsed.command} is not a command you can use`);
      invalidCommand(parsed);
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      parsed.message.reply(err.message);
      invalidCommand(parsed);
    } else if (err instanceof AuthenticationError) {
      unauthenticatedCommand(parsed);
    } else {
      logBot.warn(err.message);
    }
  }
});

client.login(config.token);
