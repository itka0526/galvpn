"use client";

import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";

export function GenerateKey({ setState, limitExceeded }: { setState: Dispatch<SetStateAction<[]>>; limitExceeded: boolean }) {
    const [loading, setLoading] = useState(false);

    const handleGenerateKey = async () => {
        setLoading(true);

        // try {
        //     const resp = await fetch("/api/keys" + `?VPNType=${VPNType}`, { method: "POST" });
        //     const res: KeyRouteRespType = await resp.json();
        //     if (res.status) {
        //         setState((prevState) => [...prevState, res.data]);
        //         toast.success(res.message);
        //     } else {
        //         toast.error(res.message);
        //     }
        // } catch (err) {
        //     console.error(err);
        //     toast.error("Алдаа гарлаа.");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <Button onClick={handleGenerateKey} disabled={loading || limitExceeded}>
            <PlusIcon className="md:mr-2 w-4 h-4" /> <span className="md:block hidden">Түлхүүр үүсгэх</span>
        </Button>
    );
}
