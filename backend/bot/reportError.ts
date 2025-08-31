import config from "../config";
import { bot } from "./bot";

const formatError = (s: string) => `
# ${new Date().toLocaleString("en", { dateStyle: "full", timeStyle: "short" }).toUpperCase()}
${s}
`;

export const reportError = (errorString: string) => {
    bot.api.sendMessage(config.adminID, formatError(errorString), { parse_mode: "HTML" });
};
