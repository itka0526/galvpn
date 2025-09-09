import config from "../../config";
import { pmBot } from "../bot";

pmBot.command("start", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    await ctx.reply("🚀", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🌐",
                        web_app: { url: config.nodeEnv === "production" ? `${config.CLIENT_ENDPOINT_ADDR}/galvpn` : "https://localhost:5173" },
                    },
                ],
            ],
        },
    });
});
