import { pmBot } from "./bot";
import handleInstructionsCbQuery from "./cbQueries/handleInstructionsCbQuery";
import handlePaymentCbQuery from "./cbQueries/handlePaymentCbQuery";
import { reportError } from "./reportError";

pmBot.on("callback_query:data", async (ctx) => {
    try {
        if (ctx.callbackQuery.data === "instructions") {
            await handleInstructionsCbQuery(ctx);
        } else {
            // [XXdays block unblock information] + -$# + DYNAMIC_DATA
            await handlePaymentCbQuery(ctx);
        }
    } catch (error) {
        console.error(error);
        return await reportError(error, "Callback error");
    } finally {
        await ctx.answerCallbackQuery();
    }
});
