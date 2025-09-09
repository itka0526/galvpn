import config from "../../config";
import { pmBot } from "../bot";

pmBot.command("start", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) return;

    const refCode = ctx.match;

    await ctx.reply("🚀", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "🕹️",
                        web_app: {
                            url:
                                config.nodeEnv === "production"
                                    ? `${config.CLIENT_ENDPOINT_ADDR}/galvpn${refCode ? `?startattach=${refCode}` : ""}`
                                    : "https://192.168.50.184:5173/galvpn?startattach=BOB123",
                        },
                    },
                ],
            ],
        },
    });
});
