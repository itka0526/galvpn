"use client";

import { Button } from "./button";
import { Loader2Icon } from "lucide-react";

export function SubmitButton({ text, pending }: { text: string; pending: boolean }) {
    return (
        <Button type="submit" className="w-full" aria-disabled={pending}>
            {pending ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Түр хүлээнэ үү...
                </>
            ) : (
                text
            )}
        </Button>
    );
}
