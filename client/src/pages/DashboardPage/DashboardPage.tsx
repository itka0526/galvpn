import { Page } from "@/components/Page";
import { cn } from "@/helpers/cn";
import myAxios from "@/myAxios";
import { Spinner } from "@telegram-apps/telegram-ui";
import { AxiosResponse, HttpStatusCode, isAxiosError } from "axios";
import { BadgeDollarSign, BadgeInfo, BadgePlus, Info } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Key } from "@shared/prisma";
import { ConfigItem } from "./components/config-item";

const itemClasses = "flex flex-col justify-center items-center px-4 py-2 select-none relative transition-all";

export const DashboardPage = () => {
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingKeys, setLoadingKeys] = useState(false);

    const [keys, setKeys] = useState<Key[]>([]);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            setLoadingKeys(true);
            const res = await myAxios.get("/keys");

            if (res.status === HttpStatusCode.Ok) {
                const resKeys = res?.data.keys as Key[];
                setKeys(resKeys);
            } else {
                // TODO: i18
                toast.error("Could not fetch keys.");
            }
        } catch (err) {
            console.error(err);
            toast.error((err as any)?.message ?? "Unknown error (DP1)");
        } finally {
            setLoadingKeys(false);
        }
    };

    const handleCreate = async () => {
        try {
            setLoadingCreate(true);

            // Check keys.ts for types
            const res: AxiosResponse<{ message: string } | ({ message: string } & Key)> = await myAxios.post("/keys");

            if ("message" in res.data) {
                toast.success(res.data.message, {
                    icon: (
                        <div className="flex items-center justify-center">
                            <Info className="w-6 h-6" />
                        </div>
                    ),
                });
            }

            if (res.status === HttpStatusCode.Ok) {
                setKeys((prevState) => [...prevState, res.data as Key]);
            }
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                toast.error(err.response.data.message, {
                    icon: (
                        <div className="flex items-center justify-center">
                            <Info className="w-6 h-6" />
                        </div>
                    ),
                });
            } else {
                // TODO: i18
                toast.error((err as any)?.message ?? "Unknown error (DP2)");
            }
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <Page back={false}>
            <main className="pb-28 flex flex-1 w-full h-full pt-4">
                <section className={"flex flex-col items-center w-full gap-6 px-6 basis-full"}>
                    {loadingKeys ? (
                        <div className="basis-full flex items-center justify-center">
                            <Spinner size="l" />
                        </div>
                    ) : (
                        keys.map((item) => <ConfigItem item={item} setUserKeys={setKeys} key={`keyID-${item.id}`} />)
                    )}
                </section>

                <section className=" left-1/2 bottom-4 fixed z-10 items-center justify-center p-4 -translate-x-1/2">
                    <div
                        className={
                            "text-gray-200 bg-gray-800/50 border-gray-700 w-full flex items-center justify-center rounded-full shadow-xl border backdrop-blur-md backdrop-saturate-[100%] px-4"
                        }
                    >
                        {/* TODO: i18 */}
                        <button className={cn(itemClasses)} onClick={handleCreate} disabled={loadingCreate}>
                            {loadingCreate ? (
                                <div className="absolute">
                                    <Spinner size="s" />
                                </div>
                            ) : null}
                            <BadgePlus className={cn("m-0 transition-colors", loadingCreate ? "stroke-gray-500" : "stroke-gray-300")} size={28} />
                            <span
                                className={cn(
                                    "text-sm text-center font-medium  transition-colors",
                                    loadingCreate ? "text-gray-500" : "text-gray-300"
                                )}
                            >
                                Create
                            </span>
                        </button>

                        {/* TODO: i18 */}
                        <div className={cn(itemClasses)}>
                            <BadgeDollarSign className="stroke-gray-300 m-0" size={28} />
                            <span className="text-sm font-medium text-center text-gray-300">Payment</span>
                        </div>

                        {/* TODO: i18 */}
                        <div className={cn(itemClasses)}>
                            <BadgeInfo className="stroke-gray-300 m-0" size={28} />
                            <span className="text-sm font-medium text-center text-gray-300">Check</span>
                        </div>
                    </div>
                </section>
            </main>
        </Page>
    );
};
