import { Router } from "express";
import { getInitData } from "../../functions";
import prisma from "../../db";
import { isInvalidReferralCodeType, referrerAddFriend } from "./functions";

const referralRouter = Router();

// TODO: i1
// This route should be protected by auth middleware
referralRouter.get("/referral", async (_, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { telegramID: initData.user.id.toString() },
            select: { _count: { select: { referrals: true } }, referralCode: true },
        });

        if (!user) {
            return res.status(400).json({ message: "User does not exist." });
        }
        const {
            _count: { referrals: referredCount },
            referralCode,
        } = user;

        return res.status(200).json({ message: "Success.", referrerData: { referredCount, referralCode } });
    } catch (error) {
        reportError(error);
        return res.status(500).json({ message: "Cannot process request." });
    }
});

referralRouter.post("/referral", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    const referralCode = req.body["referralCode"];

    if (isInvalidReferralCodeType(referralCode)) {
        // TODO: i18
        return res.status(400).json({ message: `Invalid referral code` });
    }

    try {
        const message = await referrerAddFriend({ friendID: initData.user.id.toString(), referrerCode: referralCode });

        if (message === "You have received extra days.") {
            return res.status(200).json({ message });
        } else {
            return res.status(400).json({ message });
        }
    } catch (err) {
        reportError(err);
        // TODO: i18
        return res.status(500).json({ message: "Error occurred on the server." });
    }
});

export default referralRouter;
