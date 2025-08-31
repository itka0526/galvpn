import { ErrorRequestHandler } from "express";

const defaultErrorMiddleware: ErrorRequestHandler = (err, _req, res) => {
    console.error(err);
    res.json({
        error: err?.message || "Internal Server Error",
    });
};

export { defaultErrorMiddleware };
