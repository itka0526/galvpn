import config from "../config";
import { Bot } from "grammy";
import { MyContext } from "../types";
import { generateUpdateMiddleware } from "./telemetry";

const bot = new Bot<MyContext>(config.BOT_TOKEN);
const pmBot = bot.chatType("private");

if (config.nodeEnv === "development") {
    pmBot.use(generateUpdateMiddleware());
}

export { bot, pmBot };
