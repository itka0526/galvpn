import cron from "node-cron";
import prisma from "./db";
import { bot } from "./bot/bot";
import config from "./config";
import { reportError } from "./bot/reportError";
import { expirationMessage, soonToBeExpiredMessage } from "./messages";
import child_process from "child_process";
import util from "util";
import { extractClientName } from "./functions";
import { i18next } from "./i18n";

const exec = util.promisify(child_process.exec);

console.log("Cron jobs are running...");

cron.schedule("* 0/6 * * *", async () => {
    const t = i18next.getFixedT("en");
    try {
        const now = new Date();
        const expiredUsers = await prisma.user.findMany({
            where: {
                activeTill: {
                    lt: now,
                },
            },
            select: {
                telegramID: true,
                keys: { select: { configFilePath: true } },
            },
        });

        // Freeze active keys
        if (config.nodeEnv !== "development") {
            for (const { keys } of expiredUsers) {
                for (const { configFilePath } of keys) {
                    const clientName = extractClientName(configFilePath, t);
                    await exec(`sudo bash /root/galvpn/vpn.sh --disableclient ${clientName}`);
                }
            }
        }
    } catch (error) {
        console.error(error);
        await reportError(error);
    }
});

// Notify users
cron.schedule("0 12 * * *", async () => {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    try {
        const usersToNotify = await prisma.user.findMany({
            where: {
                OR: [{ activeTill: { lt: now } }, { activeTill: { lte: threeDaysFromNow, gte: now } }],
            },
            select: {
                activeTill: true,
                telegramID: true,
                preferedLanguage: true,
            },
        });
        for (const { telegramID, activeTill, preferedLanguage } of usersToNotify) {
            await bot.api.sendMessage(telegramID, activeTill <= now ? expirationMessage(preferedLanguage) : soonToBeExpiredMessage(preferedLanguage));
            await new Promise((res) => setTimeout(res, 1000));
        }
    } catch (error) {
        await reportError(error);
    }
});
