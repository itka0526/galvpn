import { Router } from "express";
import { getInitData } from "../../functions";
import prisma from "../../db";
import config from "../../config";
import { bot } from "../../bot/bot";
import { confirmPaymentMessage } from "../../messages";
import { adminResponse } from "./functions";
import { reportError } from "../../bot/reportError";

const paymentRouter = Router();

paymentRouter.post("/payment", async (_, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    try {
        // Check if the user is banned
        const dbRes = await prisma.user.findUnique({
            where: { telegramID: initData.user.id.toString() },
            select: { banned: true, activeTill: true },
        });
        if (!dbRes) {
            return res.json({ message: "User not found." });
        }

        if (dbRes.banned) {
            return res.json({ message: "You are banned.", status: false });
        }

        await bot.api.sendMessage(config.adminID, confirmPaymentMessage(initData.user.id.toString(), dbRes.activeTill), {
            parse_mode: "HTML",
            reply_markup: adminResponse(initData.user.id.toString()),
        });

        // TODO: i18
        return res.status(200).json({ message: "Please wait till admin replies back." });
    } catch (err) {
        console.error(err);
        reportError(err);
        return res.status(500).json({ message: "Cannot handle request." });
    }
});

export default paymentRouter;
