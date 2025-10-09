export function normalizeLang(code?: string): string {
    if (!code) return "en";
    const rawBase = code.split("-");
    if (rawBase.length <= 2) {
        return code;
    }
    const base = rawBase[0] as string;
    if (["en", "ru", "mn"].includes(base)) return base;
    return "en";
}
