import { User } from "../../shared/prisma";
import config from "../config";
import prisma from "../db";
import { extractClientName } from "../functions";
import { i18next } from "../i18n";
import { reportError } from "./reportError";
import util from "util";
import child_process from "child_process";
const exec = util.promisify(child_process.exec);

export const extendByOneMonth = async (telegramID: User["telegramID"]) => {
    try {
        const user = await prisma.user.findUnique({
            where: { telegramID },
            select: { activeTill: true, keys: { select: { configFilePath: true } } },
        });
        if (!user) throw new Error("User does not exist.");

        const now = new Date();
        let activeTill = new Date(user.activeTill);

        if (now > activeTill) activeTill = now;

        activeTill.setMonth(activeTill.getMonth() + 1);

        const t = i18next.getFixedT("en");

        if (config.nodeEnv !== "development") {
            for (const { configFilePath } of user.keys) {
                const clientName = extractClientName(configFilePath, t);
                await exec(`sudo bash /root/galvpn/vpn.sh --enableclient ${clientName}`);
            }
        }

        return await prisma.user.update({ data: { activeTill }, where: { telegramID } });
    } catch (error) {
        console.error(error);
        await reportError(error);
        return error;
    }
};

export const extendBySetDays = async (telegramID: User["telegramID"], days: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { telegramID },
            select: { activeTill: true, keys: { select: { configFilePath: true } } },
        });
        if (!user) throw new Error("User does not exist.");

        const now = new Date();
        let activeTill = new Date(user.activeTill);

        if (now > activeTill) activeTill = now;

        activeTill.setDate(activeTill.getDate() + days);

        const t = i18next.getFixedT("en");

        if (config.nodeEnv !== "development") {
            for (const { configFilePath } of user.keys) {
                const clientName = extractClientName(configFilePath, t);
                await exec(`sudo bash /root/galvpn/vpn.sh --enableclient ${clientName}`);
            }
        }

        return await prisma.user.update({ data: { activeTill }, where: { telegramID } });
    } catch (error) {
        await reportError(error);
        console.error(error);
        return error;
    }
};
