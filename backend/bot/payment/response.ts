import { pmBot } from "../../bot/bot";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import config from "../../config";
import prisma from "../../db";
import { userInformation } from "../../messages";
import { reportError } from "../../bot/reportError";
import { User } from "@shared/prisma";

pmBot.on("callback_query:data", async (ctx) => {
    try {
        const rawData = ctx.callbackQuery.data;
        const [command, userID] = rawData.split("-$#");
        if (!command || !userID) {
            throw Error("Invalid data! Cannot handle exception!");
        }

        const notifyUser = async () => {
            return await ctx.api.sendMessage(userID, "🔔 Админ хариу өглөө...");
        };

        switch (command) {
            case "30days":
                await extendBySetDays(userID, 30);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminID, "🥳 Амжилттай (30)");
            case "60days":
                await extendBySetDays(userID, 60);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminID, "🥳 Амжилттай (60)");
            case "90days":
                await extendBySetDays(userID, 90);
                await notifyUser();
                return await ctx.api.sendMessage(config.adminID, "🥳 Амжилттай (90)");
            case "unblock":
                await prisma.user.update({ where: { telegramID: userID }, data: { banned: false } });
                return await ctx.api.sendMessage(config.adminID, "🥳 Амжилттай (UNBLOCK)");
            case "block":
                await prisma.user.update({ where: { telegramID: userID }, data: { banned: true } });
                return await ctx.api.sendMessage(config.adminID, "🥳 Амжилттай (BLOCK)");
            case "information":
                const user = await prisma.user.findUnique({ where: { telegramID: userID } });
                let tgUser = {};

                await ctx.reply(`ℹ️ Telegram хэрэглэгчийг хайж байна...`, { parse_mode: "HTML" });
                const stringSession = "";
                const tgClient = new TelegramClient(new StringSession(stringSession), Number(config.BOT_API_ID), config.BOT_API_HASH, {
                    connectionRetries: 3,
                    requestRetries: 3,
                    reconnectRetries: 3,
                    downloadRetries: 3,
                });
                await tgClient.start({ botAuthToken: config.BOT_TOKEN });
                const apiUser = await tgClient.invoke(new Api.users.GetFullUser({ id: userID }));
                tgUser = { ...apiUser };

                return await ctx.api.sendMessage(
                    config.adminID,
                    userInformation({ dbData: JSON.stringify(user, null, 2), tgData: JSON.stringify(tgUser, null, 2) }),
                    { parse_mode: "HTML" }
                );
        }
    } catch (error) {
        console.error(error);
        return reportError(JSON.stringify(error));
    } finally {
        await ctx.answerCallbackQuery();
    }
});

const extendBySetDays = async (userID: User["telegramID"], days: number) => {
    try {
        const user = await prisma.user.findUnique({ where: { telegramID: userID } });
        if (!user) throw new Error("Өгөгдлийн сан хариу өгөхгүй байна.");

        const now = new Date();
        let activeTill = user.activeTill;

        if (now > activeTill) activeTill = now;

        activeTill.setDate(activeTill.getDate() + days);

        return await prisma.user.update({ data: { activeTill }, where: { telegramID: user.telegramID } });
    } catch (error) {
        throw error;
    }
};
