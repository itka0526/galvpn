import express from "express";
import config from "./config";
import usersRouter from "./routes/users/users";
import cors from "cors";
import { TMA_authMiddleware } from "./middleware/auth";
import { defaultErrorMiddleware } from "./middleware/error";
import keysRouter from "./routes/keys/keys";
import "./cron";
import paymentRouter from "./routes/payment/payment";
import { webhookCallback } from "grammy";
import { bot } from "./bot/bot";
import referralRouter from "./routes/referral/referral";
import https from "https";
import http from "http";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(config.BOT_WEBHOOK_PATH, webhookCallback(bot, "express"));

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
                  ]
                : config.CLIENT_ENDPOINT_ADDR, // TODO: your Mini App’s domain
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.use(TMA_authMiddleware);

app.use(usersRouter);
app.use(keysRouter);
app.use(paymentRouter);
app.use(referralRouter);

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
