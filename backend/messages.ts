import { TFunction } from "i18next";
import { User } from "../shared/prisma";
import { i18next } from "./i18n";

const t = i18next.t;

export const expirationMessage = (language: User["preferedLanguage"]) => `
${t("expiration_message", { lng: language })}
`;

export const soonToBeExpiredMessage = (language: User["preferedLanguage"]) => `
${t("expiration_message_2", { lng: language })}
`;

export const confirmPaymentMessage = (userID: string, activeTill: Date, t: TFunction<"translation", undefined>, language: string) => `
ℹ️ ${t("admin_notif.title")}

- ${t("admin_notif.field_1")}:
    <b>${userID}</b>

- ${t("admin_notif.field_2")}:
    <b>${activeTill.toLocaleString(language, { dateStyle: "short", timeStyle: "short" })}</b>
`;

export const userInformation = ({ dbData = "", tgData = "", language }: { dbData?: string; tgData?: string; language: User["preferedLanguage"] }) => `
<blockquote>ℹ️ ${t("database", { lng: language })}</blockquote>
<blockquote expandable>${dbData}</blockquote>
<blockquote>ℹ️ ${t("telegram", { lng: language })}</blockquote>
<blockquote expandable>${tgData}</blockquote>
`;

export const usersList = (users: Partial<User>[]) => {
    return users.map(({ telegramID }) => `- <code>${telegramID}</code>`).join("\n");
};

export const adminCommands = () => `
${t("admin_cmds.title", { lng: "en" })}

# ${t("admin_cmds.all")}
/users

# ${t("admin_cmds.extend")}
/extend

# ${t("admin_cmds.info")}
/user

# ${t("admin_cmds.message")}
/message_to
`;

export const help = () => `
📩 <b>Invite your friend</b>
  - 1 month to you + 1 month to your friend

🚨 <b>Admin</b>
  - @itka0526

📣 <b>Join channel for updates</b>
  - https://t.me/+VJlZJrjLMOIzZjUy
`;
