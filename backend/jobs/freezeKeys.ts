import { bot } from "../bot/bot";
import { reportError } from "../bot/reportError";
import config from "../config";
import prisma from "../db";
import { extractClientName } from "../functions";
import { i18next } from "../i18n";
import child_process from "child_process";
import util from "util";
import { expirationMessage, soonToBeExpiredMessage } from "../messages";
const exec = util.promisify(child_process.exec);

export async function freezeKeys() {
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
            console.log(
                `Froze user keys: [${expiredUsers.map(
                    ({ telegramID, keys }) => `"${telegramID}: [${keys.map(({ configFilePath }) => `"${configFilePath.split("/").pop()} "`)}]" `
                )}]`
            );
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
}

export const notifyExpiration = async () => {
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
};
