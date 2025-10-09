import config from "../config";
import { Bot } from "grammy";
import { MyContext } from "../types";
import { generateUpdateMiddleware } from "./telemetry";

const bot = new Bot<MyContext>(config.BOT_TOKEN);
const pmBot = bot.chatType("private");

if (config.nodeEnv === "development") {
    pmBot.use(generateUpdateMiddleware());
}

// User stuff
import "./user/me";
import "./user/start";
import "./user/instructions";

// Admin stuff
import "./cbQueryData";
import "./news/share";
import "./admin/commands";

export { bot, pmBot };
