import prisma from "../../db";
import { User } from "@shared/prisma";

type CreateUserArgs = {
    telegramID: User["telegramID"];
    activeTill: User["activeTill"];
    banned?: User["banned"];
    preferedLanguage?: User["preferedLanguage"];
};

type ReadUserArgs = { telegramID: User["telegramID"] };

type ProlongUserArgs = { telegramID: User["telegramID"]; activeTill: User["activeTill"] };

type DeleteUserArgs = { telegramID: User["telegramID"] };

async function createUser({ telegramID, activeTill, banned = false, preferedLanguage = "en" }: CreateUserArgs) {
    const user = await prisma.user.create({
        data: {
            telegramID,
            activeTill,
            banned,
            preferedLanguage,
        },
    });
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

async function deleteUser({ telegramID }: DeleteUserArgs) {
    const user = await prisma.user.delete({
        where: { telegramID },
    });
    return user;
}

export { createUser, readUser, ProlongUser, deleteUser };
