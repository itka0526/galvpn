import { Router } from "express";
import { freezeKeys, notifyExpiration } from "../../jobs/freezeKeys";

const jobsRouter = Router();

jobsRouter.get("/cron/freeze", async (_, res) => {
    try {
        await freezeKeys();
        return res.json({ message: "Freeze keys succeeded." });
    } catch (_) {
        return res.json({ message: "Freeze keys failed... Check logs." });
    }
});

jobsRouter.get("/cron/notify", async (_, res) => {
    try {
        await notifyExpiration();
        return res.json({ message: "Notify succeeded." });
    } catch (_) {
        return res.json({ message: "Notify failed... Check logs." });
    }
});

export default jobsRouter;
