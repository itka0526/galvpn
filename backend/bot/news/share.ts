import config from "../../config";
import prisma from "../../db";
import { pmBot } from "../bot";
import { reportError } from "../reportError";
// import { reportError } from "../reportError";

pmBot.command("news", async (ctx) => {
    await ctx.reply(
        `
📕 Run /new_news_s5 command to add news.
   The first line will be ignored, you can add additional flags such as '#silent' or '$en' or '$ru' or '$mn'
   Content must start with %content. The content will
   be sent to all telegram users who are currently in database.
`,
        { parse_mode: "HTML" }
    );
});

pmBot.command("new_news_s6", async (ctx) => {
    if (ctx.from.id.toString() !== config.adminID) {
        return ctx.reply("You are not admin.");
    }

    const content = ctx.message.text.split("%content")[1];

    if (!content) {
        return await ctx.reply("Content is not available.");
    }

    const specificLanguage = ctx.message.text.includes("$en")
        ? "en"
        : ctx.message.text.includes("$ru")
        ? "ru"
        : ctx.message.text.includes("$mn")
        ? "mn"
        : null;

    const isSilent = ctx.message.text.includes("#silent");

    let users = await prisma.user.findMany({ select: { telegramID: true, preferedLanguage: true } });

    if (specificLanguage) {
        users = users.filter(({ preferedLanguage }) => preferedLanguage === specificLanguage);
    }

    const userIds = users.map(({ telegramID }) => Number(telegramID));

    await ctx.reply(`📢 Announcing to ${userIds.length} users. ${specificLanguage ? `Specified Language: ${specificLanguage.toUpperCase()}. ` : ""}`);

    let i = 1;
    for (const userID of userIds) {
        if (i % 7 === 0) {
            await ctx.reply(`⚙️ ${i / userIds.length}`);
        }

        try {
            if (config.adminID !== userID.toString()) await ctx.api.sendMessage(userID, content, { disable_notification: isSilent });
            await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (err) {
            await reportError(err);
        } finally {
            i++;
        }
    }

    return await ctx.api.sendMessage(config.adminID, `✅ News announced to ${userIds.length} users.`);
});
