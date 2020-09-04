import { Client, MessageEmbed } from "discord.js";
import { ParsedMessage } from "discord-command-parser";
import { logBot } from "../logging_config";

const leaderboard: MessageEmbed = new MessageEmbed()
  .setColor("#4AC55E")
  .setTitle("Current Standings")
  .setAuthor("Gnome")
  .setTimestamp();

async function cmdLeaderboard(message: ParsedMessage, client: Client) {
  logBot.debug("Leaderboard command received.");
  // TODO - Get leaderboard data from DB
  // Return all in the embed

  message.message.reply(leaderboard);
}

export { cmdLeaderboard };
