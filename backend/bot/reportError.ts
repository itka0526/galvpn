import config from "../config";
import { bot } from "./bot";

const formatError = (s: string) => `
<blockquote>${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }).toUpperCase()}</blockquote>
${s}
`;

export const reportError = (errorString: string) => {
    bot.api.sendMessage(config.adminID, formatError(errorString), { parse_mode: "HTML" });
};
