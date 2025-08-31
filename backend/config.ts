import dotenv from "dotenv";

dotenv.config();

const config = {
    port: Number(process.env["PORT"]) || 4000,
    nodeEnv: process.env["NODE_ENV"] || "development",
    tmaDomain: "https://itka0526.github.io",
    freeTrialLength: 14 * 24 * 60 * 60 * 1000,
    DNS: "1.1.1.1",
    keyLimitPerUser: 5,
    // BOT
    BOT_TOKEN: process.env["BOT_TOKEN"] as string,
    BOT_API_ID: process.env["BOT_API_ID"] as string,
    BOT_API_HASH: process.env["BOT_API_HASH"] as string,
    adminID: "5434394300",
};

if (!config.BOT_TOKEN || !config.BOT_API_ID || !config.BOT_API_HASH) {
    throw new Error("BOT_TOKEN | TELEGRAM_BOT_API_ID | TELEGRAM_BOT_API_HASH is missing.");
}

export default config;
