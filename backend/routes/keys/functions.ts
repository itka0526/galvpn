import child_process from "child_process";
import util from "node:util";

const exec = util.promisify(child_process.exec);

import prisma from "../../db";
import { randomUUID } from "crypto";
import config from "../../config";
import { Key, User } from "../../../shared/prisma";
import { reportError } from "../../bot/reportError";

/**
 *  Requires telegramID of the key's owner
 */
const createKey = async ({ telegramID }: { telegramID: User["telegramID"] }) => {
    try {
        // Check if user is allowed to create a key
        const dbRes = await prisma.user.findUnique({
            where: { telegramID },
            select: {
                activeTill: true,
                banned: true,
                _count: { select: { keys: true } },
            },
        });

        if (!dbRes) {
            // TODO: i18
            return "User was not found";
        }

        const { _count, activeTill, banned } = dbRes;
        // Check status
        if (activeTill < new Date()) {
            // TODO: i18
            return "Payment required";
        }
        if (banned) {
            // TODO: i18
            return "User is banned";
        }
        if (_count.keys >= config.keyLimitPerUser) {
            // TODO: i18
            return "Key limit reached";
        }

        // Create the key and write to disk automatically
        const cuid = `user-${randomUUID().split("-")[0]}`;

        if (config.nodeEnv !== "development") {
            await exec(`sudo bash /root/galvpn/vpn.sh --addclient ${cuid} --dns1 ${config.DNS}`);
        }

        let configFilePath: Key["configFilePath"];

        if (config.nodeEnv !== "development") {
            configFilePath = `/root/` + cuid + ".conf";
        } else {
            configFilePath = `/test` + cuid + ".conf";
        }

        // Read the key from disk
        let configFile: Key["configFile"];

        if (config.nodeEnv !== "development") {
            const { stdout } = await exec(`cat ${configFilePath}`);
            configFile = stdout;
        } else {
            configFile = "in_development".repeat(10);
        }

        // Write to database
        const key = await prisma.key.create({ data: { configFile, configFilePath, userTelegramID: telegramID } });

        if (!key) {
            return "Could not create key";
        }
        return key;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const deleteKey = async ({ telegramID, keyID }: { telegramID: User["telegramID"]; keyID: Key["id"] }) => {
    try {
        // Check if user is allowed to delete a key
        const dbRes = await prisma.user.findUnique({
            where: { telegramID },
            select: {
                activeTill: true,
                banned: true,
                keys: true,
            },
        });

        if (!dbRes) {
            // TODO: i18
            return "User was not found.";
        }

        const { activeTill, banned } = dbRes;
        // Check status
        if (activeTill < new Date()) {
            // TODO: i18
            return "Payment required.";
        }
        if (banned) {
            // TODO: i18
            return "User is banned.";
        }

        const matchedKey = dbRes.keys.find(({ id }) => id === Number(keyID));

        if (!matchedKey) return "User doesn't have this key.";

        if (config.nodeEnv !== "development") {
            const clientName = matchedKey.configFilePath.split("/").pop();

            if (!clientName) return "Data mismatch.";

            await exec(`sudo bash /root/galvpn/vpn.sh --removeclient ${clientName} -y`);
        }

        await prisma.key.delete({ where: { id: matchedKey.id } });

        // TODO: i18
        return "Key is deleted.";
    } catch (err) {
        reportError(err);
        // TODO: i18
        return "Unknown error (F1)";
    }
};
export { createKey, deleteKey };
