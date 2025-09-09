import { Router } from "express";
import { getInitData } from "../../functions";
import prisma from "../../db";
import { isInvalidReferralCodeType, referrerAddFriend } from "./functions";
import { reportError } from "../../bot/reportError";

const referralRouter = Router();

// This route should be protected by auth middleware
referralRouter.get("/referral", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { telegramID: initData.user.id.toString() },
            select: { _count: { select: { referrals: true } }, referralCode: true },
        });

        if (!user) {
            return res.status(400).json({ message: req.t("User was not found.") });
        }
        const {
            _count: { referrals: referredCount },
            referralCode,
        } = user;

        return res.status(200).json({ message: req.t("success"), referrerData: { referredCount, referralCode } });
    } catch (error) {
        await reportError(error);
        return res.status(500).json({ message: req.t("server_err") });
    }
});

referralRouter.post("/referral", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const referralCode = req.body["referralCode"];

    if (isInvalidReferralCodeType(referralCode)) {
        return res.status(400).json({ message: req.t("invalid_code") });
    }

    try {
        const message = await referrerAddFriend({ friendID: initData.user.id.toString(), referrerCode: referralCode });

        if (message === "You have received extra days.") {
            return res.status(200).json({ message: req.t(message) });
        } else {
            return res.status(400).json({ message: req.t(message) });
        }
    } catch (err) {
        await reportError(err, "Code section: (R1)");
        return res.status(500).json({ message: req.t("server_err") });
    }
});

export default referralRouter;
