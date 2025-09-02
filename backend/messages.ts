// TODO: i18

import { User } from "../shared/prisma";

export const expirationMessage = `
Your subscription has ended.
`;

export const soonToBeExpiredMessage = `
Your subscription ends in 3 days.
`;

export const confirmPaymentMessage = (userID: string, activeTill: Date) => `
ℹ️ User has paid subscription.

- User:
    <b>${userID}</b>

- Expiration date:
    <b>${activeTill.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</b>
`;

export const userInformation = ({ dbData = "", tgData = "" }) => `
<blockquote>ℹ️ Database</blockquote>
<blockquote expandable>${dbData}</blockquote>
<blockquote>ℹ️ Telegram</blockquote>
<blockquote expandable>${tgData}</blockquote>
`;

export const usersList = (users: Partial<User>[]) => {
    return users.map(({ telegramID }) => `- <code>${telegramID}</code>`).join("\n");
};

export const adminCommands = `
Командууд:

# Хэрэглэгчидийн нэрсийн жагсалт
/users

# Сунгах - extend userEmail dayToAdd
/extend

# Хэрэглэгч - userEmail
/user
`;
