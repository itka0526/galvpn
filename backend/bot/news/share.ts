import config from "../../config";
import prisma from "../../db";
import { pmBot } from "../bot";
import { reportError } from "../reportError";

pmBot.command("news", async (ctx) => {
    await ctx.reply(
        `
📕 Run /news_add command to add news.
   The first line will be ignored, you can add additional flags such as '#silent'
   the rest of the content will
   be sent to all telegram users who are currently in database.
`,
        { parse_mode: "HTML" }
    );
});

pmBot.command("news_add", async (ctx) => {
    const rawData = ctx.message.text.split("\n");
    const content = rawData.slice(1).join("\n");

    try {
        const users =
            config.nodeEnv === "production" ? await prisma.user.findMany({ select: { telegramID: true } }) : [{ telegramID: config.adminID }];

        const userIds = users.map(({ telegramID }) => Number(telegramID));

        await ctx.api.sendMessage(config.adminID, `📢 Announcing to ${userIds.length} users`);

        for (const userId of userIds) {
            try {
                await ctx.api.sendMessage(userId, content, {
                    disable_notification: rawData.includes("#silent"),
                });
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (err) {
                reportError(err);
            }
        }

        await ctx.api.sendMessage(config.adminID, `✅ News announced to ${userIds.length} users.`);
    } catch (err) {
        reportError(err);
    }
});
