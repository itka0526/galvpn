"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownUp, Calendar, ChartPie, Download, LucideQrCode, Trash2, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Key } from "@shared/prisma";
import myAxios from "@/myAxios";
import { cn } from "@/helpers/cn";
import { HttpStatusCode } from "axios";
import { KeyStatsType } from "@shared/types";
import { humanFileSize } from "./human-readable-file-size";

type ConfigItemProps = { item: Key; setUserKeys: Dispatch<SetStateAction<Key[]>> };

export function ConfigItem({ item: { configFile, id, configFilePath }, setUserKeys }: ConfigItemProps) {
    const [open, setOpen] = useState(false);

    const [deletingKey, setDeletingKey] = useState(false);

    const deleteKey = async () => {
        try {
            setDeletingKey(!deletingKey);

            const res = await myAxios.delete("/keys", { params: { keyID: id } });

            if (res.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
                setUserKeys((prev) => prev.filter((other) => other.id !== id));
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            // i18
            toast.error("Unknown error (CI1)");
        } finally {
            setDeletingKey(false);
        }
    };

    const fileName = configFilePath.split("/").pop()?.replace("user", "key") ?? "RANDOM_KEY";

    const downloadKey = async () => {
        try {
            const res = await myAxios.get("/keys/download", { params: { keyID: id } });

            if (!("message" in res.data)) return toast.error("Unknown error (DK1)");

            if (res.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Unknown error (DK2)");
        }
    };

    const checkStats = async () => {
        try {
            const res = await myAxios.get("/keys/stats", { params: { keyID: id } });

            if (res.status === HttpStatusCode.Ok) {
                const stats = res.data as KeyStatsType;

                toast.success(
                    <span className="font-semibold">
                        {humanFileSize(stats.transfer.in, true)} received, <br /> {humanFileSize(stats.transfer.out, true)} sent{" "}
                    </span>,
                    { icon: <ArrowDownUp />, duration: 3000 }
                );

                toast.success(
                    stats.latest > 0 ? (
                        <p>
                            Key was last used <br />
                            <span className="font-semibold">
                                {new Date(stats.latest * 1000).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
                            </span>
                        </p>
                    ) : (
                        <p>Key hasn't been used for a long time</p>
                    ),
                    { icon: <Calendar />, duration: 2500 }
                );

                console.log(stats);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Unknown error (DK3)");
        }
    };

    return (
        <>
            {open && (
                <div
                    className="fixed z-50 inset-0 w-screen h-screen bg-[rgba(255,255,255,0.2)] flex justify-center items-center"
                    onClick={() => setOpen(false)}
                >
                    <div className="top-8 right-8 absolute">
                        <XIcon width={48} height={48} color="black" className="hover:rotate-90 transition-transform cursor-pointer" />
                    </div>
                    <div className="p-6 bg-white rounded-md shadow-md pointer-events-none">
                        <QRCode value={configFile} size={280} />
                    </div>
                </div>
            )}
            <CardContent className="max-md:p-0 flex flex-col w-full" aria-disabled={deletingKey}>
                <Textarea
                    readOnly
                    value={`# ${fileName}\n\n${configFile}`}
                    className={cn(
                        `focus:ring-gray-700 focus:border-gray-700 h-64 mb-4 font-mono text-sm text-gray-200 bg-gray-800 border-gray-700`,
                        deletingKey ? "blur-xs" : ""
                    )}
                    placeholder="Nothing..."
                />
                <div className=" flex gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => deleteKey()} disabled={deletingKey}>
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {/* TODO: i18 */}

                                <p className="text-sm text-gray-400">{deletingKey ? "Deleting..." : "Delete key"}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={downloadKey} disabled={deletingKey}>
                                    <Download />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {/* TODO: i18 */}

                                <p className="text-sm text-gray-400">Download</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={checkStats} disabled={deletingKey}>
                                    <ChartPie />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {/* TODO: i18 */}
                                <p className="text-sm text-gray-400">Show stats</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => setOpen(true)} className="w-full" disabled={deletingKey}>
                                    <LucideQrCode className="mr-2" />
                                    {/* TODO: i18 */}

                                    <span className="font-medium text-white">QR code</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {/* TODO: i18 */}

                                <p className="text-sm text-gray-400">Scan QR code</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </>
    );
}
