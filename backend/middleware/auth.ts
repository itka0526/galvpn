import { RequestHandler } from "express";
import { validate, parse, InitData, isExpiredError } from "@telegram-apps/init-data-node";
import config from "../config";
import { CustomResponse } from "../types";
import { setInitData } from "../functions";
import { UnauthorizedError } from "telegram/errors";

const TMA_authMiddleware: RequestHandler = (req, res: CustomResponse, next) => {
    // We expect passing init data in the Authorization header in the following format:
    // <auth-type> <auth-data>
    // <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ""] = (req.header("authorization") || "").split(" ");

    if (authType === "tma") {
        try {
            // MUST VALIDATE TOKEN OR ELSE CRSF!
            if (config.nodeEnv !== "development") {
                validate(authData, config.BOT_TOKEN, {
                    // We consider init data sign valid for 1 day from their creation moment.
                    expiresIn: 60 * 60 * 24,
                });
            }

            setInitData(res, parse(authData) as InitData);
            return next();
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return res.status(418).json({ message: "Unauthorized. Please restart the app." });
            }
            if (isExpiredError(error)) {
                // TODO: i18
                return res.status(418).json({ message: "Please restart the app." });
            }
            return next(error);
        }
    }
    return next(new Error("Unauthorized"));
};

export { TMA_authMiddleware };
