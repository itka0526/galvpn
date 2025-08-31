import { InlineKeyboard } from "grammy";

export const adminResponse = (userID: string) =>
    new InlineKeyboard()
        .text("🔓 АН-БЛОКЛОХ", `unblock-$#${userID}`)
        .text("🗑️ БЛОКЛОХ", `block-$#${userID}`)
        .row()
        .text("🗓️ 30 хоног", `30days-$#${userID}`)
        .text("🗓️ 60 хоног", `60days-$#${userID}`)
        .text("🗓️ 90 хоног", `90days-$#${userID}`)
        .row()
        .text("ℹ️ Мэдээлэл", `information-$#${userID}`)
        .row();
