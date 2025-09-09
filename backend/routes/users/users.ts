import { Router } from "express";
import { getInitData } from "../../functions";
import { CustomResponse } from "../../types";
import { createUser, readUser, UpdateUserLanguage } from "./functions";
import config from "../../config";
import { User } from "../../../shared/prisma";
import { reportError } from "../../bot/reportError";
import { isInvalidReferralCodeType, referrerAddFriend } from "../referral/functions";

const usersRouter = Router();

// This route should be protected by auth middleware
usersRouter.post("/users", async (req, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    try {
        const referralCode = config.nodeEnv === "development" ? "YBA20X" : req.query["referralCode"];

        // Check if user exists
        const existingUser = await readUser({ telegramID: initData.user.id.toString() });

        if (existingUser) {
            // Check if they used referral
            if (referralCode && typeof referralCode === "string" && !isInvalidReferralCodeType(referralCode)) {
                const refRes = await referrerAddFriend({ friendID: existingUser.telegramID, referrerCode: referralCode });
                return res.status(200).json({ ...existingUser, message: req.t(refRes) });
            }
            return res.status(200).json(existingUser);
        }

        // Create user
        const freeTrialEndDate = new Date(new Date().getTime() + config.freeTrialLength);

        let preferedLanguage: User["preferedLanguage"];
        switch (initData.user.language_code) {
            case "ru":
                preferedLanguage = "ru";
                break;
            default:
                preferedLanguage = "en";
                break;
        }

        const user = await createUser({ telegramID: initData.user.id.toString(), activeTill: freeTrialEndDate, preferedLanguage });

        // Check if they used referral
        if (referralCode && typeof referralCode === "string" && !isInvalidReferralCodeType(referralCode)) {
            const refRes = await referrerAddFriend({ friendID: user.telegramID, referrerCode: referralCode });
            return res.status(200).json({ ...user, message: req.t(refRes) });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

usersRouter.get("/users", async (req, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    try {
        const user = await readUser({ telegramID: initData.user.id.toString() });
        if (!user) res.status(400).json({ message: "User does not exist." });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        await reportError(typeof error === "object" ? JSON.stringify(error) : `${error}`);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

usersRouter.put("/users/language", async (req, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const rawLanguage = req.body["language"];

    const supportedLanguages: User["preferedLanguage"][] = ["en", "mn", "ru"];

    if (!rawLanguage || !supportedLanguages.includes(rawLanguage as User["preferedLanguage"])) {
        return res.status(400).json({ message: req.t("not_supported") });
    }

    try {
        const user = await UpdateUserLanguage({ telegramID: initData.user.id.toString(), preferedLanguage: rawLanguage as User["preferedLanguage"] });
        if (!user) res.status(400).json({ message: req.t("User was not found.") });
        return res.status(200).json({ user, message: req.t("lng_changed", { lng: user.preferedLanguage }) });
    } catch (error) {
        console.error(error);
        await reportError(typeof error === "object" ? JSON.stringify(error) : `${error}`);
        return res.status(500).json({ message: req.t("server_err") });
    }
});

export default usersRouter;
