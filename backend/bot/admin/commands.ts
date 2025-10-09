import { _downloadPhoto } from "telegram/client/downloads";
import { pmBot } from "../bot";
import config from "../../config";
import prisma from "../../db";
import { adminCommands, usersList } from "../../messages";
import { extendByOneMonth, extendBySetDays } from "../extend";
import { getUserDataExtended } from "../getUserDataExtended";
import { reportError } from "../reportError";

pmBot.command("help", async (ctx) => {
    if (`${ctx.from.id}` === config.adminID) {
        return await ctx.reply(adminCommands(), { parse_mode: "HTML" });
    } else {
        return await ctx.reply("👮 You are not the admin", { parse_mode: "HTML" });
    }
});

pmBot.command("users", async (ctx) => {
    if (`${ctx.from.id}` === config.adminID) {
        const users = await prisma.user.findMany({ select: { telegramID: true }, orderBy: { createdAt: "asc" } });
        const list = "Users:\n" + `<blockquote expandable>${usersList(users)}</blockquote>`;
        return await ctx.reply(list, { parse_mode: "HTML" });
    } else {
        return await ctx.reply("👮 You are not the admin", { parse_mode: "HTML" });
    }
});

pmBot.command("user", async (ctx) => {
    if (`${ctx.from.id}` !== config.adminID) {
        return await ctx.reply("👮 You are not the admin", { parse_mode: "HTML" });
    }

    // Expect the command to be '/user userID'
    const rawMessage = ctx.message.text;
    const [userID] = rawMessage.split(" ").slice(1);
    if (!userID) {
        return await ctx.reply("ℹ️ Invalid userID.");
    }
    const user = await prisma.user.findUnique({ where: { telegramID: userID } });
    if (!user) await ctx.reply(`ℹ️ User not found.`, { parse_mode: "HTML" });
    else await ctx.reply(`<code>${JSON.stringify(user, null, 2)}</code>`, { parse_mode: "HTML" });

    await ctx.reply(`ℹ️ Searching user`, { parse_mode: "HTML" });
    return await getUserDataExtended({ ctx, userID });
});

pmBot.command("extend", async (ctx) => {
    if (`${ctx.from.id}` !== config.adminID) {
        return await ctx.reply("👮 You are not the admin", { parse_mode: "HTML" });
    }

    const rawMessage = ctx.message.text;
    const [userID, days] = rawMessage.split(" ").slice(1);
    if (!userID) {
        return await ctx.reply("ℹ️ Invalid arguments");
    }

    days ? await extendBySetDays(userID, Number(days)) : await extendByOneMonth(userID);
    return await ctx.reply("ℹ️ Success");
});

pmBot.command("message_to", async (ctx) => {
    if (`${ctx.from.id}` !== config.adminID) {
        return await ctx.reply("👮 You are not the admin", { parse_mode: "HTML" });
    }

    const rawMessage = ctx.message.text;

    const [userID, ...message] = rawMessage.split(" ").slice(1);

    if (!userID || !message) {
        return await ctx.reply("ℹ️ Invalid arguments /message_to userID message");
    }

    const user = await prisma.user.findUnique({ where: { telegramID: userID } });

    if (user) {
        await ctx.reply(`<code>${JSON.stringify(user, null, 2)}</code>`, { disable_notification: true, parse_mode: "HTML" });
    } else {
        await ctx.reply("User does not exist.", { disable_notification: true });
    }
    try {
        await ctx.api.sendMessage(userID, message.join(" "));
        return ctx.reply("ℹ️ Message sent");
    } catch (err) {
        return await reportError("", "Cannot send message to " + userID);
    }
});
