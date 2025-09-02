import { User } from "@shared/prisma";

export const ShowStatus = ({ user }: { user: User | null }) => {
    const now = new Date();

    if (!user) {
        return <span className="font-semibold text-red-500">Unknown</span>;
    }

    if (user.banned) {
        return <span className="font-semibold text-red-400"> You are banned </span>;
    }

    if (new Date(user.activeTill) > now) {
        return (
            <span className="font-semibold text-green-400">
                Active till {new Date(user.activeTill).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
            </span>
        );
    }

    if (new Date(user.activeTill) < now) {
        return <span className="font-semibold text-red-400">Inactive</span>;
    }

    return <span className="font-semibold text-red-500">Unknown</span>;
};
