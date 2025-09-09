import { Router } from "express";
import { getInitData } from "../../functions";
import prisma from "../../db";
import config from "../../config";
import { bot } from "../../bot/bot";
import { confirmPaymentMessage } from "../../messages";
import { adminResponse } from "./functions";
import { reportError } from "../../bot/reportError";

const paymentRouter = Router();

paymentRouter.post("/payment", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    try {
        // Check if the user is banned
        const dbRes = await prisma.user.findUnique({
            where: { telegramID: initData.user.id.toString() },
            select: { banned: true, activeTill: true },
        });
        if (!dbRes) {
            return res.json({ message: req.t("User was not found.") });
        }

        if (dbRes.banned) {
            return res.json({ message: req.t("User is banned."), status: false });
        }

        await bot.api.sendMessage(config.adminID, confirmPaymentMessage(initData.user.id.toString(), dbRes.activeTill, req.t, req.language), {
            parse_mode: "HTML",
            reply_markup: adminResponse(initData.user.id.toString()),
        });

        return res.status(200).json({ message: req.t("admin_reply") });
    } catch (err) {
        console.error(err);
        await reportError(err);
        return res.status(500).json({ message: req.t("server_err") });
    }
});

export default paymentRouter;
