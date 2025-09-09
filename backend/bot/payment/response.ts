import { pmBot } from "../../bot/bot";
import config from "../../config";
import prisma from "../../db";
import { reportError } from "../../bot/reportError";
import { getUserDataExtended } from "../getUserDataExtended";
import { extendBySetDays } from "../extend";

pmBot.on("callback_query:data", async (ctx) => {
    try {
        if (ctx.from.id.toString() !== config.adminID) {
            await reportError("Someone tried accessing protected endpoint.");
            return await ctx.reply("You are not the admin.");
        }

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
                if (!user) {
                    return await ctx.api.sendMessage(config.adminID, "User does not exist.");
                }
                return await getUserDataExtended({ ctx, userID: user.telegramID });
        }
    } catch (error) {
        console.error(error);
        return await reportError(error);
    } finally {
        await ctx.answerCallbackQuery();
    }
});
