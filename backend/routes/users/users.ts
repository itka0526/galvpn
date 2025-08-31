import { Router } from "express";
import { getInitData } from "../../functions";
import { CustomResponse } from "../../types";
import { createUser, readUser } from "./functions";
import config from "../../config";
import { User } from "@shared/prisma";

const usersRouter = Router();

// This route should be protected by auth middleware
usersRouter.post("/users", async (_, res) => {
    const initData = getInitData(res as unknown as CustomResponse);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Please restart the app or try again later." });
    }

    try {
        // Check if user exists
        const existingUser = await readUser({ telegramID: initData.user.id.toString() });

        if (existingUser) return res.status(200).json(existingUser);

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

        const user = createUser({ telegramID: initData.user.id.toString(), activeTill: freeTrialEndDate, preferedLanguage });

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Could not fulfill request." });
    }
});

export default usersRouter;
