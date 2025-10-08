import { Page } from "@/components/Page";
import { cn } from "@/helpers/cn";
import myAxios from "@/myAxios";
import { Spinner } from "@telegram-apps/telegram-ui";
import { AxiosResponse, HttpStatusCode, isAxiosError } from "axios";
import { BadgeDollarSign, BadgePlus, Info, LoaderCircle, RotateCw, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Key, User } from "@shared/prisma";
import { ConfigItem } from "./components/config-item";
import { Link } from "react-router-dom";
import { ShowStatus } from "./components/show-status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import rocketAnimation from "../../../assets/rocket.json";

const itemClasses = "flex flex-col justify-center items-center px-4 py-2 select-none relative transition-all";

export const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const [loadingUser, setLoadingUser] = useState(false);

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [loadingKeys, setLoadingKeys] = useState(false);

    const [keys, setKeys] = useState<Key[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchKeys();
        fetchUser();
    }, []);

    const refresh = async () => {
        await Promise.all([fetchKeys(), fetchUser]);
    };

    const fetchUser = async () => {
        try {
            setLoadingUser(true);
            const res = await myAxios.get("/users");
            if ("message" in res.data) {
                if (res.status === HttpStatusCode.Ok) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            }

            if (res.status === HttpStatusCode.Ok) {
                setUser(res.data);
                i18n.changeLanguage(res.data.preferedLanguage);
                myAxios.defaults.headers.common["Accept-Language"] = res.data.preferedLanguage;
            }
        } catch (err) {
            console.error(err);
            toast.error(t("server_unreachable"));
        } finally {
            setLoadingUser(false);
        }
    };

    const fetchKeys = async () => {
        try {
            setLoadingKeys(true);
            const res = await myAxios.get("/keys");

            if ("message" in res.data && res.status !== HttpStatusCode.Ok) {
                toast.error(res.data.message);
            }

            if (res.status === HttpStatusCode.Ok) {
                const resKeys = res?.data.keys as Key[];
                setKeys(resKeys);
            }
        } catch (err) {
            console.error(err);
            toast.error(t("server_unreachable"));
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
                toast.error((err as any)?.message ?? t("unknown") + " (DP2)");
            }
        } finally {
            setLoadingCreate(false);
        }
    };

    const languages = ["en", "mn", "ru"];

    const handleLanguageChange = async (newLanguage: string) => {
        setLoadingUser(true);
        try {
            if (newLanguage !== user?.preferedLanguage) {
                const res = await myAxios.put("/users/language", { language: newLanguage });

                if ("message" in res.data) {
                    if (res.status === HttpStatusCode.Ok) {
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                    }
                }

                if (res.status === HttpStatusCode.Ok) {
                    setUser(res.data.user);
                    const updatedLanguage = res.data.user?.preferedLanguage;
                    i18n.changeLanguage(updatedLanguage);
                    myAxios.defaults.headers.common["Accept-Language"] = updatedLanguage;
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(t("server_unreachable"));
        } finally {
            setLoadingUser(false);
        }
    };

    return (
        <Page back={false}>
            <main className="pb-28 pt-28 flex flex-1 w-full h-full max-w-xl">
                <section className={"flex flex-col items-center w-full gap-6 px-6 basis-full"}>
                    {loadingKeys || loadingUser ? (
                        <div className="basis-full flex items-center justify-center">
                            <Spinner size="l" />
                        </div>
                    ) : (
                        <>
                            {user ? (
                                <div className="flex items-center justify-between w-full p-3 text-gray-200 bg-gray-800 border border-gray-700 rounded-md">
                                    <ShowStatus user={user} />
                                    <Select value={i18n.language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Language"} />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="center">
                                            {languages.map((l, idx) => {
                                                return (
                                                    <SelectItem value={l} key={`choice-${idx}`}>
                                                        {l.toUpperCase()}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : null}
                            {keys.length === 0 && !(loadingKeys || loadingUser) ? (
                                <div className="flex flex-col items-center justify-center p-3 text-center bg-gray-800 border border-gray-700 rounded-md shadow-md">
                                    <p className={cn("text-gray-200 leading-relaxed text-2xl font-bold")}>{t("welcome.p1")}</p>
                                    <div className="max-w-52">
                                        <Lottie animationData={rocketAnimation} loop />
                                    </div>
                                    <p className={cn(i18n.language !== "en" ? "text-base" : "text-lg", "text-gray-200 leading-relaxed font-medium")}>
                                        {t("welcome.p2")}
                                    </p>
                                </div>
                            ) : null}
                            {keys.map((item) => (
                                <ConfigItem item={item} setUserKeys={setKeys} key={`keyID-${item.id}`} />
                            ))}
                        </>
                    )}
                </section>

                <section className=" left-1/2 bottom-4 fixed z-10 items-center justify-center p-4 -translate-x-1/2">
                    <div
                        className={cn(
                            "text-gray-200 bg-gray-800/50 border-gray-700 w-full flex items-center justify-center rounded-full shadow-xl border backdrop-blur-md backdrop-saturate-[100%] ",
                            i18n.language !== "en" ? "px-2" : "px-4"
                        )}
                    >
                        <button className={cn(itemClasses)} onClick={handleCreate} disabled={loadingCreate}>
                            {loadingCreate ? (
                                <LoaderCircle className={cn("m-0 transition-colors", "stroke-gray-500 animate-spin")} size={28} />
                            ) : (
                                <BadgePlus className={cn("m-0 transition-colors", "stroke-gray-300")} size={28} />
                            )}
                            <span
                                className={cn(
                                    "text-sm text-center font-medium  transition-colors",
                                    loadingCreate ? "text-gray-500" : "text-gray-300",
                                    i18n.language !== "en" ? "text-xs" : ""
                                )}
                            >
                                {t("create")}
                            </span>
                        </button>

                        <Link className={cn(itemClasses)} to="/payment">
                            <BadgeDollarSign className="stroke-gray-300 m-0" size={28} />
                            <span className={cn("text-sm font-medium text-center text-gray-300", i18n.language !== "en" ? "text-xs" : "")}>
                                {t("payment")}
                            </span>
                        </Link>

                        <button className={cn(itemClasses)} onClick={refresh} disabled={loadingKeys || loadingKeys}>
                            <RotateCw className={cn("stroke-gray-300 m-0", loadingKeys || loadingKeys ? "animate-spin" : "")} size={28} />
                            <span
                                className={cn(
                                    "text-sm font-medium text-center ",
                                    loadingKeys || loadingKeys ? "text-gray-500" : "text-gray-300",
                                    i18n.language !== "en" ? "text-xs" : ""
                                )}
                            >
                                {t("refresh")}
                            </span>
                        </button>

                        <Link className={cn(itemClasses)} to="/refer">
                            <UserPlus className={cn("stroke-gray-300 m-0")} size={28} />
                            <span className={cn("text-sm font-medium text-center", "text-gray-300", i18n.language !== "en" ? "text-xs" : "")}>
                                {t("refer")}
                            </span>
                        </Link>
                    </div>
                </section>
            </main>
        </Page>
    );
};
