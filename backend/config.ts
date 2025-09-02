import dotenv from "dotenv";

dotenv.config();

const config = {
    port: Number(process.env["PORT"]) || 4000,
    nodeEnv: process.env["NODE_ENV"] || "development",
    CLIENT_ENDPOINT_ADDR: process.env["CLIENT_ENDPOINT_ADDR"],
    freeTrialLength: 14 * 24 * 60 * 60 * 1000,
    DNS: "1.1.1.1",
    keyLimitPerUser: 5,
    // BOT
    BOT_TOKEN: process.env["BOT_TOKEN"] as string,
    BOT_API_ID: process.env["BOT_API_ID"] as string,
    BOT_API_HASH: process.env["BOT_API_HASH"] as string,
    BOT_WEBHOOK_PATH: process.env["BOT_WEBHOOK_PATH"] as string,
    adminID: "5434394300",
    referralA: 30,
    referralB: 14,
    SSLKeyPath: process.env["SSL_KEY_PATH"],
    SSLCertPath: process.env["SSL_CERT_PATH"],
    domain: process.env["DOMAIN"],
};

if (!config.BOT_TOKEN || !config.BOT_API_ID || !config.BOT_API_HASH || !config.BOT_WEBHOOK_PATH) {
    throw new Error("BOT_TOKEN | TELEGRAM_BOT_API_ID | TELEGRAM_BOT_API_HASH | BOT_WEBHOOK_PATH is missing.");
}

export default config;
