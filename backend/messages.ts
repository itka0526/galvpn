// TODO: i18

export const expirationMessage = `
Your subscription has ended.
`;

export const soonToBeExpiredMessage = `
Your subscription ends in 3 days.
`;

export const confirmPaymentMessage = (userID: string, activeTill: Date) => `
ℹ️ User has paid subscription. Please check your bank.

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
