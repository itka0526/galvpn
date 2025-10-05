import cron from "node-cron";
import { freezeKeys, notifyExpiration } from "./jobs/freezeKeys";
import { reportError } from "./bot/reportError";

console.log("Cron jobs are running...");

cron.schedule("* 0/6 * * *", freezeKeys);

cron.schedule("0 12 * * *", notifyExpiration);

cron.schedule("*/3 * * * *", () => reportError("", new Date().toDateString()));
