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
usersRouter.post("/users", async (_, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Please restart the app or try again later." });
    }

    try {
        const referralCode = config.nodeEnv === "development" ? "YBA20X" : initData.start_param?.toString();

        // Check if user exists
        const existingUser = await readUser({ telegramID: initData.user.id.toString() });

        if (existingUser) {
            // Check if they used referral
            if (referralCode && !isInvalidReferralCodeType(referralCode)) {
                await referrerAddFriend({ friendID: existingUser.telegramID, referrerCode: referralCode });
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
        if (referralCode && !isInvalidReferralCodeType(referralCode)) {
            await referrerAddFriend({ friendID: user.telegramID, referrerCode: referralCode });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

usersRouter.get("/users", async (_, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Please restart the app or try again later." });
    }

    try {
        const user = await readUser({ telegramID: initData.user.id.toString() });
        if (!user) res.status(400).json({ message: "User does not exist." });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        reportError(typeof error === "object" ? JSON.stringify(error) : `${error}`);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

usersRouter.put("/users/language", async (req, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Please restart the app or try again later." });
    }

    const rawLanguage = req.body["language"];

    const supportedLanguages: User["preferedLanguage"][] = ["en", "mn", "ru"];

    if (!rawLanguage || !supportedLanguages.includes(rawLanguage as User["preferedLanguage"])) {
        return res.status(400).json({ message: "Language not supported." });
    }

    try {
        const user = await UpdateUserLanguage({ telegramID: initData.user.id.toString(), preferedLanguage: rawLanguage as User["preferedLanguage"] });
        // TODO: i18
        if (!user) res.status(400).json({ message: "User does not exist." });
        return res.status(200).json({ user, message: "Language changed." });
    } catch (error) {
        console.error(error);
        reportError(typeof error === "object" ? JSON.stringify(error) : `${error}`);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

export default usersRouter;
