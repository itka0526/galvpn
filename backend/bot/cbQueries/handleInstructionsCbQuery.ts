import { Context } from "grammy";
import { retrieveInstructions } from "../user/instructions";
import { reportError } from "../reportError";

export default async function handleInstructionsCbQuery(ctx: Context) {
    const instructions = await retrieveInstructions();
    if (!instructions) {
        return reportError("", "Instructions are missing");
    }
    return await ctx.replyWithMediaGroup(instructions);
}
