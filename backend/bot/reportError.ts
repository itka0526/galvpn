import config from "../config";
import { bot } from "./bot";

const formatError = (s: string) => `
<blockquote>${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }).toUpperCase()}</blockquote>
${s}
`;

export const reportError = async (error: unknown, comment?: string) => {
    await bot.api.sendMessage(config.adminID, formatError(comment ?? "" + "\n" + (typeof error === "object" ? JSON.stringify(error) : `${error}`)), {
        parse_mode: "HTML",
    });
};
