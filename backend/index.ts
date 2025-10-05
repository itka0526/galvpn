import express, { Router } from "express";
import config from "./config";
import usersRouter from "./routes/users/users";
import cors from "cors";
import { TMA_authMiddleware } from "./middleware/auth";
import { defaultErrorMiddleware } from "./middleware/error";
import keysRouter from "./routes/keys/keys";
import paymentRouter from "./routes/payment/payment";
import { webhookCallback } from "grammy";
import { bot } from "./bot/bot";
import referralRouter from "./routes/referral/referral";
import https from "https";
import http from "http";
import fs from "fs";
import { i18Middleware, i18next } from "./i18n";
import { freezeKeys, notifyExpiration } from "./jobs/freezeKeys";
import { reportError } from "./bot/reportError";

import "./cron";

const app = express();

app.use(express.json());
app.use(config.BOT_WEBHOOK_PATH, webhookCallback(bot, "express"));
app.use(i18Middleware.handle(i18next));

app.use(
    cors({
        origin:
            config.nodeEnv === "development"
                ? [
                      "https://172.20.10.2:5173",
                      "https://10.7.0.2:5173",
                      "https://192.168.50.184:5173",
                      "https://127.0.0.1:5173",
                      "https://localhost:5173",
                      "http://localhost:5173",
                      "http://127.0.0.1:5173",
                  ]
                : config.CLIENT_ENDPOINT_ADDR,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send(req.t("index"));
});

app.get("/cron", async (_, res) => {
    try {
        await freezeKeys();
        await notifyExpiration();
        res.send("*** MANUAL JOB COMPLETE ***");
    } catch (error) {
        await reportError(error);
        res.send("*** MANUAL JOB FAILED ***");
    }
});

app.use("/public", express.static("public"));

const protectedRouter = Router();

protectedRouter.use(TMA_authMiddleware);

protectedRouter.use(usersRouter);
protectedRouter.use(keysRouter);
protectedRouter.use(paymentRouter);
protectedRouter.use(referralRouter);

app.use(protectedRouter);

app.use(defaultErrorMiddleware);

if (config.port === 443) {
    if (!config.SSLCertPath || !config.SSLKeyPath) {
        throw Error("SSL config missing...");
    }
    https.createServer({ cert: fs.readFileSync(config.SSLCertPath), key: fs.readFileSync(config.SSLKeyPath) }, app).listen(config.port, async () => {
        console.log(`HTTPS server is running on port ${config.port}...`);
    });
} else {
    http.createServer(app).listen(config.port, async () => {
        console.log(`HTTP server is running on port ${config.port}...`);
    });
}
