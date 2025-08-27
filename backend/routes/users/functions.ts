import prisma from "../../db";
import { User } from "../../generated/prisma";

type CreateUserArgs = {
    telegramID: User["telegramID"];
    activeTill: User["activeTill"];
    banned?: User["banned"];
};

type ReadUserArgs = { telegramID: User["telegramID"] };

type UpdateUserArgs = { telegramID: User["telegramID"]; activeTill: User["activeTill"] };

type DeleteUserArgs = { telegramID: User["telegramID"] };

async function createUser({ telegramID, activeTill, banned = false }: CreateUserArgs) {
    const user = await prisma.user.create({
        data: {
            telegramID,
            activeTill,
            banned,
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

async function updateUser({ telegramID, activeTill }: UpdateUserArgs) {
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

export { createUser, readUser, updateUser, deleteUser };
