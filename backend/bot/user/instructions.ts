import { InputFile, InputMediaVideo } from "grammy/types";
import { pmBot } from "../bot";
import path from "path";

const instructionVideos = [
    path.resolve(process.cwd(), "./public/iOS.mp4"),
    path.resolve(process.cwd(), "./public/mac.mp4"),
    path.resolve(process.cwd(), "./public/payment.mp4"),
];

pmBot.command("instructions", async (ctx) => {
    const mediaGroup: InputMediaVideo[] = instructionVideos.map((file) => ({
        type: "video",
        media: new InputFile(file),
        caption: `📖 ${file.split("/").pop()?.replace(".mp4", "")} `,
    }));

    await ctx.replyWithMediaGroup(mediaGroup);
});
