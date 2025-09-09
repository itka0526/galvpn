import { cn } from "@/helpers/cn";
import { User } from "@shared/prisma";
import { useTranslation } from "react-i18next";

export const ShowStatus = ({ user }: { user: User | null }) => {
    const { t, i18n } = useTranslation();

    const now = new Date();

    if (!user) {
        return <span className="font-semibold text-red-500">{t("unknown_user")}</span>;
    }

    if (user.banned) {
        return <span className="font-semibold text-red-400">{t("User is banned")} </span>;
    }

    if (new Date(user.activeTill) > now) {
        return (
            <span className={cn("font-semibold text-green-400", i18n.language !== "en" ? "text-sm" : "")}>
                {t("active_till", { date: new Date(user.activeTill).toLocaleString(i18n.language, { dateStyle: "short", timeStyle: "short" }) })}
            </span>
        );
    }

    if (new Date(user.activeTill) < now) {
        return <span className="font-semibold text-red-400">{t("inactive")}</span>;
    }

    return <span className="font-semibold text-red-500">{t("unknown_user")}</span>;
};
