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
import { findJobsAbove400 } from "./jobs/yandexSmena";

const app = express();

app.use(express.json());
app.use(i18Middleware.handle(i18next));
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
                      "http://localhost:5173",
                      "http://127.0.0.1:5173",
                  ]
                : config.CLIENT_ENDPOINT_ADDR,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
    })
);

app.get("/", (_, res) => {
    return res.send(`
<div style="display:flex;flex-direction:column;gap:0rem;padding:1rem 2rem;">
  <p>Answers: <a href="https://docs.google.com/document/d/1-M-ckOUBmcF_TLpJVLm7TSXCByLxcHvHQeLasaZtzaQ/edit?usp=sharing">Google Docs</a></p>
  <p>VPN: <a href="https://chromewebstore.google.com/detail/free-vpn-for-chrome-vpn-p/majdfhpaihoncoakbjgbdhglocklcgno?hl=en&pli=1">Chrome Store</a></p>
  <p>Copy: <a href="https://chromewebstore.google.com/detail/allow-copy-+/ajhbdcgfhlhhmocddefknjjkejcfpbnj?hl=en">Chrome Store</a></p>
  <p>SyncShare: <a href="https://chromewebstore.google.com/detail/syncshare/lngijbnmdkejbgnkakeiapeppbpaapib">Chrome Store</a></p>
  <span>imback0526</span>
  <span>password$123</span>
  <p>AI: <a href="https://chromewebstore.google.com/detail/sider-chat-with-all-ai-gp/difoiogjjojoaoomphldepapgpbgkhkb?hl=en">Chrome Store</a></p>
  <span>AIzaSyDNCq5CdSR-Jm-xpPgIwDa0zzB4ka4sfSk</span>
</div>
        `);
});

app.get("/cron", async (_, res) => {
    try {
        await freezeKeys();
        await notifyExpiration();
        await findJobsAbove400();
        return res.send("*** MANUAL JOB COMPLETE ***");
    } catch (error) {
        await reportError(error);
        return res.send("*** MANUAL JOB FAILED ***");
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
