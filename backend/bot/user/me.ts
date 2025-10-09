import { pmBot } from "../bot";

pmBot.command("me", async (ctx) => {
    return await ctx.reply(ctx.from.id.toString());
});
