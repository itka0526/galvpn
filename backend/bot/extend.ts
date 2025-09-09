import { User } from "../../shared/prisma";
import prisma from "../db";
import { reportError } from "./reportError";

export const extendByOneMonth = async (telegramID: User["telegramID"]) => {
    try {
        const user = await prisma.user.findUnique({ where: { telegramID } });
        if (!user) throw new Error("User does not exist.");

        const now = new Date();
        let activeTill = new Date(user.activeTill);

        if (now > activeTill) activeTill = now;

        activeTill.setMonth(activeTill.getMonth() + 1);
        return await prisma.user.update({ data: { activeTill }, where: { telegramID } });
    } catch (error) {
        console.error(error);
        await reportError(error);
        return error;
    }
};

export const extendBySetDays = async (telegramID: User["telegramID"], days: number) => {
    try {
        const user = await prisma.user.findUnique({ where: { telegramID } });
        if (!user) throw new Error("User does not exist.");

        const now = new Date();
        let activeTill = new Date(user.activeTill);

        if (now > activeTill) activeTill = now;

        activeTill.setDate(activeTill.getDate() + days);
        return await prisma.user.update({ data: { activeTill }, where: { telegramID } });
    } catch (error) {
        await reportError(error);
        console.error(error);
        return error;
    }
};
