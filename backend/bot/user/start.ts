import config from "../../config";
import { i18next } from "../../i18n";
import { pmBot } from "../bot";
import { retrieveInstructions } from "./instructions";

function normalizeLang(code?: string): string {
    if (!code) return "en";
    const rawBase = code.split("-");
    if (rawBase.length <= 2) {
        return code;
    }
    const base = rawBase[0] as string;
    if (["en", "ru", "mn"].includes(base)) return base;
    return "en";
}

pmBot.command("start", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) return;

    const refCode = ctx.match;

    const lang = normalizeLang(ctx.from?.language_code);

    let startText = i18next.t("start_button", { lng: lang });

    if (refCode) {
        const hintMessage = i18next.t("referral_hint", {
            lng: lang,
            code: refCode,
        });

        await ctx.reply(hintMessage, { parse_mode: "MarkdownV2" });
    }

    const instructions = await retrieveInstructions();

    await ctx.replyWithMediaGroup(instructions);

    await ctx.reply("▶️ Start", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: startText,
                        web_app: {
                            url:
                                config.nodeEnv === "production"
                                    ? `${config.CLIENT_ENDPOINT_ADDR}/galvpn${refCode ? `?startattach=${refCode}` : ""}`
                                    : "https://192.168.50.184:5173?startattach=BOB123",
                        },
                    },
                ],
            ],
        },
    });
});
