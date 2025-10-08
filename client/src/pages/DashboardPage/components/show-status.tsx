import { User } from "@shared/prisma";
import { ShieldAlert, ShieldBan, ShieldCheck, ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ShowStatus = ({ user }: { user: User | null }) => {
    const { t, i18n } = useTranslation();

    const now = new Date();

    if (!user) {
        return (
            <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert size={24} />
                <div className="flex flex-col text-left">
                    <span className="font-medium">{t("unknown_user")}</span>
                    <span className="text-xs">{t("unknown")}</span>
                </div>
            </div>
        );
    }

    if (user.banned) {
        return (
            <div className="flex items-center gap-3 text-red-400">
                <ShieldBan size={24} />
                <div className="flex flex-col text-left">
                    <span className="font-medium">{t("User is banned")}</span>
                    <span className="text-xs">{t("admin_reply")}</span>
                </div>
            </div>
        );
    }

    if (new Date(user.activeTill) > now) {
        return (
            <div className="flex items-center gap-3 text-green-400">
                <ShieldCheck size={24} />
                <div className="flex flex-col text-left">
                    <span className="font-medium">{t("active_till")}</span>
                    <span className="text-xs">
                        {new Date(user.activeTill).toLocaleString(i18n.language, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                        {` [${user.telegramID}]`}
                    </span>
                </div>
            </div>
        );
    }

    if (new Date(user.activeTill) < now) {
        return (
            <div className="flex items-center gap-3 text-red-400">
                <ShieldX size={24} />
                <div className="flex flex-col text-left">
                    <span className="font-medium">{t("inactive")}</span>
                    <span className="text-xs">
                        {new Date(user.activeTill).toLocaleString(i18n.language, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                        {` [${user.telegramID}]`}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 text-red-400">
            <ShieldAlert size={24} />
            <div className="flex flex-col text-left">
                <span className="font-medium">{t("unknown_user")}</span>
                <span className="text-xs">{t("Unknown error occurred.")}</span>
            </div>
        </div>
    );
};
