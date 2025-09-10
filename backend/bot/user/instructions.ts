import { InputMediaVideo } from "grammy/types";
import { pmBot } from "../bot";
import config from "../../config";

const videoBaseURL = config.nodeEnv === "production" ? config.domain : "http://localhost:4000";

const instructionVideos = [videoBaseURL + "/public/iOS.mp4"];

pmBot.command("instructions", async (ctx) => {
    const mediaGroup: InputMediaVideo[] = instructionVideos.map((file) => ({
        type: "video",
        media: file,
        caption: `📖 ${file.split("/").pop()} `,
    }));

    await ctx.replyWithMediaGroup(mediaGroup);
});
