import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/helpers/cn";

interface AccountDetailsProps {
    content: string;
    className?: string;
}

export const AccountDetails = ({ content, className }: AccountDetailsProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);

    const handleCopy = async () => {
        if (spanRef.current) {
            await navigator.clipboard.writeText(spanRef.current.textContent || "");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <span className={cn("relative inline-flex items-center group", className)}>
            <span ref={spanRef} className="pr-6">
                {content}
            </span>
            <button
                onClick={handleCopy}
                className="hover-hover:group-hover:opacity-100 absolute right-0 p-1 transition-opacity opacity-0"
                aria-label={isCopied ? "Copied" : "Copy to clipboard"}
            >
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="hover:text-gray-700 w-4 h-4 text-gray-500" />}
            </button>
            <span className="sr-only">{isCopied ? "Copied" : "Copy to clipboard"}</span>
        </span>
    );
};
