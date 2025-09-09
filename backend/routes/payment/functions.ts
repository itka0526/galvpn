import { InlineKeyboard } from "grammy";

export const adminResponse = (userID: string) =>
    new InlineKeyboard()
        .text("🔓", `unblock-$#${userID}`)
        .text("⛔️", `block-$#${userID}`)
        .row()
        .text("🗓️ 30D", `30days-$#${userID}`)
        .text("🗓️ 60D", `60days-$#${userID}`)
        .text("🗓️ 90D", `90days-$#${userID}`)
        .row()
        .text("ℹ️", `information-$#${userID}`)
        .row();
