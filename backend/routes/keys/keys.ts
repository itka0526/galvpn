import { Router } from "express";
import { createKey, deleteKey } from "./functions";
import { extractClientName, getInitData } from "../../functions";
import prisma from "../../db";
import { bot } from "../../bot/bot";
import { InputFile } from "grammy";
import { reportError } from "../../bot/reportError";
import util from "util";
import child_process from "child_process";
import config from "../../config";

const exec = util.promisify(child_process.exec);
const keysRouter = Router();

keysRouter.post("/keys", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const keyOrMessage = await createKey({ telegramID: initData.user.id.toString() });

    if (!keyOrMessage) {
        reportError(`${req.t("failed_to_create_key")} ${initData.user.id.toString()}`);
        return res.status(400).json({ message: req.t("unknown") });
    }

    if (keyOrMessage === "Payment required") {
        return res.status(402).json({ message: req.t(keyOrMessage) });
    }

    if (typeof keyOrMessage === "string") {
        console.log("FIJNLASF", req.t(keyOrMessage));
        return res.status(400).json({ message: req.t(keyOrMessage) });
    }

    return res.status(200).json({ ...keyOrMessage, message: req.t("key_is_created") });
});

keysRouter.get("/keys", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
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
        return res.status(500).json({ message: req.t("server_err") });
    }
});

keysRouter.delete("/keys", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        return res.status(400).json({ message: req.t("bad_req") });
    }

    try {
        const message = await deleteKey({ telegramID: initData.user.id.toString(), keyID: Number(rawKeyId), t: req.t });

        if (message === "Key is deleted.") {
            return res.status(200).json({ message: req.t(message) });
        }

        if (message === "Payment required.") {
            return res.status(402).json({ message: req.t(message) });
        }

        if (message === "Unknown error (F1)") {
            reportError(message);
            return res.status(500).json({ message: req.t("unknown") + " (F1)" });
        }

        return res.status(400).json({ message: req.t(message) });
    } catch (error) {
        console.error(error);
        reportError(error, "Code section: (F2)");
        return res.status(400).json({ message: req.t("unknown") + " (F2)" });
    }
});

keysRouter.get("/keys/download", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        return res.status(400).json({ message: req.t("bad_req") });
    }

    try {
        const key = await prisma.key.findUnique({ where: { userTelegramID: initData.user.id.toString(), id: Number(rawKeyId) } });

        if (!key) {
            return res.status(400).json({ message: req.t("key_is_missing") });
        }
        await bot.api.sendDocument(initData.user.id, new InputFile(Buffer.from(key.configFile, "utf-8"), key.configFilePath.split("/").pop()));
        return res.status(200).json({ message: req.t("check_chat") });
    } catch (err) {
        reportError(err, "Code section: (K1)");
        return res.status(500).json({ message: req.t("unknown") + " (K1)" });
    }
});

keysRouter.get("/keys/stats", async (req, res) => {
    const initData = getInitData(res);

    if (!initData || !initData.user) {
        return res.status(418).json({ message: req.t("bad_req") + " " + req.t("restart") });
    }

    const rawKeyId = req.query["keyID"];

    if (!rawKeyId || isNaN(Number(rawKeyId))) {
        return res.status(400).json({ message: req.t("bad_req") });
    }

    try {
        const key = await prisma.key.findUnique({ where: { userTelegramID: initData.user.id.toString(), id: Number(rawKeyId) } });

        if (!key) {
            return res.status(400).json({ message: req.t("key_is_missing") });
        }
        const clientName = extractClientName(key.configFilePath, req.t);

        let keyStats: string;

        if (config.nodeEnv !== "development") {
            const { stdout } = await exec(`sudo bash /root/galvpn/vpn.sh --showclientstats ${clientName}`);
            keyStats = stdout;
        } else {
            // Template
            keyStats = '{"keyName":"admin","latest":1756661980,"transfer":{"in":127600904,"out":2656002760}}';
        }
        return res.status(200).json(JSON.parse(keyStats));
    } catch (err) {
        reportError(err, "Code section: (K2)");
        return res.status(500).json({ message: req.t("unknown") + " (K2)" });
    }
});

export default keysRouter;
