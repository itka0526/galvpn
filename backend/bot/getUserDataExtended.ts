import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import config from "../config";
import { _downloadPhoto } from "telegram/client/downloads";
import { InputFile } from "grammy";
import { Context } from "grammy";
import { User } from "../../shared/prisma";
import { reportError } from "./reportError";

export const getUserDataExtended = async ({ ctx, userID }: { ctx: Context; userID: User["telegramID"] }) => {
    try {
        const stringSession = "";
        const tgClient = new TelegramClient(new StringSession(stringSession), Number(config.BOT_API_ID), config.BOT_API_HASH, {
            connectionRetries: 3,
        });
        await tgClient.start({ botAuthToken: config.BOT_TOKEN });

        const apiUser = await tgClient.invoke(new Api.users.GetFullUser({ id: userID }));

        if (apiUser.fullUser) {
            if (apiUser.fullUser.profilePhoto) {
                await ctx.reply(`ℹ️ Downloading photo`, { parse_mode: "HTML" });

                if (apiUser.fullUser.profilePhoto.className === "Photo") {
                    const photoBuffer = await _downloadPhoto(tgClient, apiUser.fullUser.profilePhoto);

                    const photo = new InputFile(Uint8Array.from(photoBuffer as Buffer), "profile.png");
                    await ctx.replyWithPhoto(photo);
                } else {
                    await ctx.reply(`ℹ️ Sorry, user doesn't have profile photo...`, { parse_mode: "HTML" });
                }
            }
            await ctx.replyWithDocument(new InputFile(Buffer.from(JSON.stringify(apiUser.toJSON(), null, 2), "utf-8"), `${userID}_data.json`));
        } else {
            return await ctx.reply(`<b>Could not get extended user data for ${userID}</b>`, { parse_mode: "HTML" });
        }
    } catch (error) {
        console.error(error);
        return await reportError(error);
    }
};
