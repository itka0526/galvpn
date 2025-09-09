import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import config from "@/config";
import myAxios from "@/myAxios";
import { copyTextToClipboard } from "@telegram-apps/sdk-react";
import { Spinner } from "@telegram-apps/telegram-ui";
import { HttpStatusCode, isAxiosError } from "axios";
import { Link } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export const ReferPage = () => {
    const [referrerData, setReferrerData] = useState<null | { referredCount: number; referralCode: string }>(null);
    const [referrerLink, setReferrerLink] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const fetchReferralData = async () => {
        setLoading(!loading);

        try {
            const res = await myAxios.get("/referral");

            if ("message" in res.data) {
                if (res.status !== HttpStatusCode.Ok) {
                    toast.error(res.data.message);
                }
            }
            if (res.status === HttpStatusCode.Ok) {
                setReferrerData(res.data.referrerData);
                setReferrerLink(`${config.botLink}?startattach=${res.data.referrerData.referralCode}`);
            }
        } catch (err) {
            console.error(err);
            toast.error(t("server_unreachable"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferralData();
    }, []);

    const handleCopyCode = async () => {
        if (referrerData) {
            await copyTextToClipboard(referrerData.referralCode);
            toast.success(referrerData.referralCode, { icon: null });
        }
    };

    const [referrerCode, setReferrerCode] = useState("");

    const updateReferrerCode = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // keep only A-Z and 0-9
        if (value.length >= 6) {
            try {
                setLoading(true);
                const res = await myAxios.post("/referral", {
                    referralCode: value,
                });
                if ("message" in res.data) {
                    if (res.status === HttpStatusCode.Ok) {
                        toast.success(res.data.message);
                    }
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    if ("message" in err.response?.data) {
                        return toast.error(err.response?.data.message);
                    }
                }
                console.error(err);
                toast.error(t("server_unreachable"));
            } finally {
                setLoading(false);
            }
            return;
        }
        setReferrerCode(value);
    };

    const handleCopyLink = async () => {
        if (referrerLink) {
            await copyTextToClipboard(referrerLink);
            toast.success(t("link_copied"), { icon: <Link size={24} /> });
        }
    };

    return (
        <Page back>
            <main className="pt-28 flex flex-1 w-full h-full max-w-xl py-6">
                <section className={"flex flex-col items-center justify-center w-full gap-6 px-6 basis-full"}>
                    {loading ? (
                        <div className="basis-full flex items-center justify-center">
                            <Spinner size="l" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full gap-4 p-4 text-gray-200 bg-gray-800 border border-gray-700 rounded-md ">
                            <p className="text-center">{t("referral_instruction.share")}</p>

                            {referrerLink && (
                                <Button
                                    variant={"default"}
                                    onClick={handleCopyLink}
                                    className="w-40 h-10 px-1 overflow-hidden bg-gray-600 border border-gray-500"
                                >
                                    <input value={referrerLink} className="w-full border-none outline-none" readOnly></input>
                                </Button>
                            )}

                            <p className="text-center">
                                {t("referral_instruction.bonus", { referralA: config.referralA, referralB: config.referralB })}
                            </p>

                            <p className="text-center">{t("referral_instruction.code")}</p>

                            {referrerData && (
                                <Button variant={"default"} onClick={handleCopyCode} className="w-40 h-10 bg-gray-600 border border-gray-500">
                                    {referrerData.referralCode}
                                </Button>
                            )}
                            <p className="text-center">{t("referral_instruction.other")}</p>

                            <div className="place-items-center grid w-full grid-rows-2 gap-4">
                                <p>{t("referral_instruction.code_b")}</p>
                                <Input
                                    value={referrerCode}
                                    onChange={updateReferrerCode}
                                    className="w-40 h-10 text-gray-300 bg-gray-600 border-gray-500"
                                />
                            </div>

                            <p className="text-center">{t("referral_instruction.count", { count: referrerData?.referredCount ?? 0 })}</p>
                        </div>
                    )}
                </section>
            </main>
        </Page>
    );
};
