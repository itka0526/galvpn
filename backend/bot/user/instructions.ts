import { InputMediaVideo } from "grammy/types";
import { pmBot } from "../bot";
import path from "path";

const instructionVideos = [path.join(__dirname, "../assets/instructions/iOS.mp4")];

pmBot.command("instructions", async (ctx) => {
    const mediaGroup: InputMediaVideo[] = instructionVideos.map((file) => ({
        type: "video",
        media: file,
        caption: `📖 ${file.split("/").pop()} `,
    }));

    await ctx.replyWithMediaGroup(mediaGroup);
});
