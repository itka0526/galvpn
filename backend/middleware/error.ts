import { ErrorRequestHandler } from "express";
import { reportError } from "../bot/reportError";

const defaultErrorMiddleware: ErrorRequestHandler = async (err, _req, res) => {
    console.error(err);
    if (res.json) {
        res.json({
            error: err?.message || "Internal Server Error",
        });
    } else {
        await reportError(err, "# DEFAULT MIDDLEWARE");
    }
};

export { defaultErrorMiddleware };
