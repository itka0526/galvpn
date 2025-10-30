import cron from "node-cron";
import { freezeKeys, notifyExpiration } from "./jobs/freezeKeys";
import { findJobsAbove400 } from "./jobs/yandexSmena";

console.log("Cron jobs are running...");

cron.schedule("0 0,6,12,18 * * *", freezeKeys, { timezone: "Europe/Moscow" });

cron.schedule("0 0,12 * * *", notifyExpiration, { timezone: "Europe/Moscow" });

cron.schedule("*/5 * * * *", findJobsAbove400, { timezone: "Europe/Moscow" });
