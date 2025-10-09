import config from "../../config";
import prisma from "../../db";
import { pmBot } from "../bot";
import { reportError } from "../reportError";

pmBot.command("news", async (ctx) => {
    await ctx.reply(
        `
📕 Run /new_news_sss command to add news.
   The first line will be ignored, you can add additional flags such as '#silent' or '$en' or '$ru' or '$mn'
   the rest of the content will
   be sent to all telegram users who are currently in database.
`,
        { parse_mode: "HTML" }
    );
});

pmBot.command("new_news_sss", async (ctx) => {
    const rawData = ctx.message.text.split("\n");
    const content = rawData.slice(1).join("\n");

    const specificLanguage = ctx.message.text.includes("$en")
        ? "en"
        : ctx.message.text.includes("$ru")
        ? "ru"
        : ctx.message.text.includes("$mn")
        ? "mn"
        : null;

    let users =
        config.nodeEnv === "production"
            ? await prisma.user.findMany({ select: { telegramID: true, preferedLanguage: true } })
            : [{ telegramID: config.adminID, preferedLanguage: "en" }];

    if (specificLanguage) {
        users = users.filter(({ preferedLanguage }) => preferedLanguage === specificLanguage);
    }

    const userIds = users.map(({ telegramID }) => Number(telegramID));

    await ctx.api.sendMessage(
        config.adminID,
        `📢 Announcing to ${userIds.length} users. ${specificLanguage ? `Specified Language: ${specificLanguage}. ` : ""}`
    );

    let i = 1;
    for (const _ of userIds) {
        if (i % 7 === 0) {
            await ctx.api.sendMessage(config.adminID, `⚙️ ${i / userIds.length}`);
        }
        try {
            await ctx.api.sendMessage(config.adminID, content, {
                disable_notification: ctx.message.text.includes("#silent"),
            });
            await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (err) {
            await reportError(err);
        } finally {
            i++;
        }
    }

    return await ctx.api.sendMessage(config.adminID, `✅ News announced to ${userIds.length} users.`);
});
