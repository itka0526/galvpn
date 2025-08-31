import { Context } from "grammy";

const DEFAULT_MAX_CONTENT_LENGTH = 64;

export function generateUpdateMiddleware(label = "", maxContentLength = DEFAULT_MAX_CONTENT_LENGTH) {
    return async (ctx: Context, next: () => Promise<void>) => {
        const identifier = contextIdentifier(ctx, label, maxContentLength);
        console.time(identifier);
        try {
            if (next) {
                await next();
            }
        } finally {
            console.timeEnd(identifier);
        }
    };
}

function contextIdentifier(ctx: Context, label = "", maxContentLength = DEFAULT_MAX_CONTENT_LENGTH) {
    const updateId = ctx.update.update_id.toString(36);
    const updateType = Object.keys(ctx.update)
        .filter((o) => o !== "update_id")
        .join("|");
    const identifierPartsRaw = [
        new Date().toISOString(),
        updateId,
        updateType,
        ctx.chat && "title" in ctx.chat && ctx.chat.title,
        ctx.from?.first_name,
        label,
        ...contextIdentifierContentPart(ctx, maxContentLength),
    ];
    const identifierParts = identifierPartsRaw.filter(Boolean);
    const identifier = identifierParts.join(" ");
    return identifier;
}

function contextIdentifierContentPart(ctx: Context, maxContentLength: number) {
    const content = contentFromContext(ctx);
    if (!content) {
        return [];
    }
    const lengthString = String(content.length);
    // @ts-ignore
    const withoutNewlines = content.replaceAll("\n", "\\n");
    const suffix = withoutNewlines.length > maxContentLength ? "…" : "";
    const contentString = withoutNewlines.slice(0, maxContentLength) + suffix;
    return [lengthString, contentString];
}

function contentFromContext(ctx: Context) {
    if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
        return ctx.callbackQuery.data;
    }
    if (ctx.message) {
        if ("text" in ctx.message) {
            return ctx.message.text;
        }
        if ("caption" in ctx.message) {
            return ctx.message.caption;
        }
        // TODO: implement different messages
    }
    return ctx.inlineQuery?.query;
}
