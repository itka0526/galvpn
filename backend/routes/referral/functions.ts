import { User } from "../../../shared/prisma";
import { extendBySetDays } from "../../bot/extend";
import { reportError } from "../../bot/reportError";
import config from "../../config";
import prisma from "../../db";

export const referrerAddFriend = async ({ referrerCode, friendID }: { referrerCode: User["referralCode"]; friendID: User["telegramID"] }) => {
    try {
        // Check referrer
        const referrer = await prisma.user.findUnique({
            where: { referralCode: referrerCode },
            select: { telegramID: true, referrerId: true, banned: true },
        });

        if (!referrer) {
            return "Referrer does not exist.";
        }

        if (referrer.banned) {
            return "Referrer is banned.";
        }

        // Check friend
        const friend = await prisma.user.findUnique({
            where: { telegramID: friendID },
            select: { telegramID: true, referrerId: true },
        });

        if (!friend) {
            return "Referrer's friend does not exist.";
        }

        if (referrer.telegramID === friend.telegramID) {
            return "You cannot refer yourself.";
        }

        if (friend.telegramID === referrer.referrerId) {
            return "You cannot refer your own referrer.";
        }

        if (friend?.referrerId) {
            return "Someone already referred this user.";
        }

        await prisma.user.update({
            where: { telegramID: friendID },
            data: { referrer: { connect: { referralCode: referrerCode } } },
        });

        // Give bonus to referrer
        await extendBySetDays(referrer.telegramID, config.referralA);

        // Give bonus to friend
        await extendBySetDays(friend.telegramID, config.referralB);

        return `You have received extra days.`;
    } catch (error) {
        reportError(error, "# functions.ts");
        return "Unknown error occurred.";
    }
};

export const isInvalidReferralCodeType = (referralCode: string) => {
    return !referralCode || referralCode.length < 6 || typeof referralCode !== "string" || /[^A-Z0-9]/g.test(referralCode);
};
