import { User } from "../../../shared/prisma";
import { reportError } from "../../bot/reportError";
import prisma from "../../db";
import { customAlphabet } from "nanoid";

type CreateUserArgs = {
    telegramID: User["telegramID"];
    activeTill: User["activeTill"];
    banned?: User["banned"];
    preferedLanguage?: User["preferedLanguage"];
    referrerCode?: User["referralCode"] | undefined;
};

type ReadUserArgs = { telegramID: User["telegramID"] };

type ProlongUserArgs = { telegramID: User["telegramID"]; activeTill: User["activeTill"] };

type UpdateUserLanguageArgs = { telegramID: User["telegramID"]; preferedLanguage: User["preferedLanguage"] };

type DeleteUserArgs = { telegramID: User["telegramID"] };

const generateReferralCode = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

async function createUser({ telegramID, activeTill, banned = false, preferedLanguage = "en" }: CreateUserArgs) {
    const user = await prisma.user.create({
        data: {
            telegramID,
            activeTill,
            banned,
            preferedLanguage,
            referralCode: generateReferralCode(),
        },
    });
    reportError(user, "# NEW USER HAS JOINED");
    return user;
}

async function readUser({ telegramID }: ReadUserArgs) {
    const user = await prisma.user.findUnique({
        where: { telegramID },
    });
    return user;
}

async function ProlongUser({ telegramID, activeTill }: ProlongUserArgs) {
    const user = await prisma.user.update({
        where: { telegramID },
        data: { activeTill },
    });
    return user;
}

async function UpdateUserLanguage({ telegramID, preferedLanguage }: UpdateUserLanguageArgs) {
    const user = await prisma.user.update({
        where: { telegramID },
        data: { preferedLanguage },
    });
    return user;
}

async function deleteUser({ telegramID }: DeleteUserArgs) {
    const user = await prisma.user.delete({
        where: { telegramID },
    });
    return user;
}

export { createUser, readUser, ProlongUser, deleteUser, UpdateUserLanguage };
