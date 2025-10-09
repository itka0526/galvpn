import { InputFile } from "grammy";
import config from "../../config";
import { i18next } from "../../i18n";
import { pmBot } from "../bot";
import { normalizeLang } from "../helpers";
import path from "path";
import fs from "fs";

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function retrieveRandomSticker() {
    const dirPath = path.resolve(process.cwd(), "./public/start");
    const filesNames = fs.readdirSync(dirPath);

    if (filesNames.length <= 0) {
        return null;
    }

    const index = randomIntFromInterval(0, filesNames.length - 1);

    const sticker = new InputFile(path.join(dirPath, filesNames[index] as string));
    return sticker;
}

pmBot.command("start", async (ctx) => {
    const userId = ctx.from?.id;

    if (!userId) return;

    const refCode = ctx.match;

    const lang = normalizeLang(ctx.from?.language_code);

    let startText = i18next.t("start_button", { lng: lang }),
        instructionText = i18next.t("instruction_button", { lng: lang });

    if (refCode) {
        const hintMessage = i18next.t("referral_hint", {
            lng: lang,
            code: refCode,
        });

        await ctx.reply(hintMessage, { parse_mode: "MarkdownV2" });
    }

    const replyMarkup = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: instructionText,
                        callback_data: "instructions",
                    },
                ],
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
    };

    const sticker = retrieveRandomSticker();

    if (!sticker) {
        return ctx.reply("🚀", replyMarkup);
    } else {
        return await ctx.replyWithSticker(sticker, replyMarkup);
    }
});
