import { Router } from "express";
import { createKey, deleteKey } from "./functions";
import { getInitData } from "../../functions";
import prisma from "../../db";
import { bot } from "../../bot/bot";
import { InputFile } from "grammy";
import { reportError } from "../../bot/reportError";
import util from "util";
import child_process from "child_process";
import config from "../../config";

const exec = util.promisify(child_process.exec);
const keysRouter = Router();

keysRouter.post("/keys", async (_, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    const keyOrMessage = await createKey({ telegramID: initData.user.id.toString() });

    if (!keyOrMessage) {
        // TODO: i18 + send telegram notification to admin
        return res.status(400).json({ message: "Unhandled error. Please notify the admin." });
    }

    if (keyOrMessage === "Payment required") {
        return res.status(402).json({ message: keyOrMessage });
    }
    if (typeof keyOrMessage === "string") {
        return res.status(400).json({ message: keyOrMessage });
    }

    // TODO: i18
    return res.status(200).json({ ...keyOrMessage, message: "Key is created." });
});

keysRouter.get("/keys", async (_, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    try {
        const keys = await prisma.key.findMany({
            where: {
                userTelegramID: initData.user.id.toString(),
            },
        });
        return res.status(200).json({ keys });
    } catch (err) {
        reportError(err, "/keys GET");
        return res.status(500).json({ message: "Server failed to respond." });
    }
});

keysRouter.delete("/keys", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        // TODO: i18
        return res.status(400).json({ message: "Bad request." });
    }

    try {
        const message = await deleteKey({ telegramID: initData.user.id.toString(), keyID: Number(rawKeyId) });

        if (message === "Key is deleted.") {
            return res.status(200).json({ message });
        }

        if (message === "Payment required.") {
            return res.status(402).json({ message });
        }

        if (message === "Unknown error (F1)") {
            reportError(message);
            return res.status(500).json({ message });
        }

        return res.status(400).json({ message });
    } catch (error) {
        console.error(error);
        // TODO: i18
        return res.status(400).json({ message: "Unknown error (F2)" });
    }
});

keysRouter.get("/keys/download", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        // TODO: i18
        return res.status(400).json({ message: "Bad request." });
    }

    try {
        const key = await prisma.key.findUnique({ where: { userTelegramID: initData.user.id.toString(), id: Number(rawKeyId) } });

        if (!key) {
            return res.status(400).json({ message: "Key is missing." });
        }
        await bot.api.sendDocument(initData.user.id, new InputFile(Uint8Array.from(key.configFile), key.configFilePath.split("/").pop()));
        // TODO: i18
        return res.status(200).json({ message: "Please check your telegram chat." });
    } catch (err) {
        reportError(err);
        // TODO: i18
        return res.status(500).json({ message: "Unknown error (K1)" });
    }
});

keysRouter.get("/keys/stats", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        // TODO: i18
        return res.status(418).json({ message: "Bad request. Please restart the app." });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        // TODO: i18
        return res.status(400).json({ message: "Bad request." });
    }

    try {
        const key = await prisma.key.findUnique({ where: { userTelegramID: initData.user.id.toString(), id: Number(rawKeyId) } });

        if (!key) {
            // TODO: i18
            return res.status(400).json({ message: "Key is missing." });
        }
        const fileName = key.configFilePath.split("/").pop();
        // TODO: i18
        if (!fileName) return res.status(500).json({ message: "Cannot process key." });
        const keyName = fileName.split(".conf")[0];
        // TODO: i18
        if (!fileName) return res.status(500).json({ message: "Cannot process key." });

        let keyStats: string;

        if (config.nodeEnv !== "development") {
            const { stdout } = await exec(`sudo bash /root/galvpn/vpn.sh --showclientstats ${keyName}`);
            keyStats = stdout;
        } else {
            // Template
            keyStats = '{"keyName":"admin","latest":1756661980,"transfer":{"in":127600904,"out":2656002760}}';
        }
        return res.status(200).json(JSON.parse(keyStats));
    } catch (err) {
        reportError(err);
        // TODO: i18
        return res.status(500).json({ message: "Unknown error (K2)" });
    }
});

export default keysRouter;
