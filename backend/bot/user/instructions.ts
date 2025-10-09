import { InputFile, InputMediaVideo } from "grammy/types";
import { pmBot } from "../bot";
import path from "path";
import fs from "fs/promises";
import { reportError } from "../reportError";

export const retrieveInstructions = async () => {
    const dirPath = path.resolve(process.cwd(), "./public");

    const files = (await fs.readdir(dirPath)).filter((f) => f.endsWith(".mp4"));

    if (files.length <= 0) {
        return null;
    }

    const mediaGroup: InputMediaVideo[] = files.map((file) => ({
        type: "video",
        media: new InputFile(path.join(dirPath, file)),
        caption: `📖 ${file.replace(".mp4", "").toUpperCase()} `,
    }));

    return mediaGroup;
};

pmBot.command("instructions", async (ctx) => {
    try {
        const mediaGroup = await retrieveInstructions();
        if (!mediaGroup) return ctx.reply("📘⛔️");
        return await ctx.replyWithMediaGroup(mediaGroup);
    } catch (error) {
        await reportError(error, "Instructions:");
        return await ctx.reply("❌❌❌");
    }
});
