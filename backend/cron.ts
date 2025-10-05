import cron from "node-cron";
import { freezeKeys, notifyExpiration } from "./jobs/freezeKeys";

console.log("Cron jobs are running...");

cron.schedule("0 0/6 * * *", freezeKeys);

cron.schedule("0 12 * * *", notifyExpiration);
