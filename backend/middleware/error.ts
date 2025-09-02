import { ErrorRequestHandler } from "express";
import { reportError } from "../bot/reportError";

const defaultErrorMiddleware: ErrorRequestHandler = (err, _req, res) => {
    console.error(err);
    if (res.json) {
        res.json({
            error: err?.message || "Internal Server Error",
        });
    } else {
        reportError(err, "# DEFAULT MIDDLEWARE");
    }
};

export { defaultErrorMiddleware };
