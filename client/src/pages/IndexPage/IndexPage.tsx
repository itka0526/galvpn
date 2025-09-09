import { useEffect, type FC } from "react";
import { Page } from "@/components/Page.tsx";
import { HttpStatusCode } from "axios";
import Lottie from "lottie-react";
import fireAnimation from "../../../assets/fire.json";
import { useNavigate } from "react-router-dom";
import myAxios from "@/myAxios";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

export const IndexPage: FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    async function HandleUser() {
        try {
            const resp = await myAxios.post("/users");

            if (resp.status === HttpStatusCode.Ok) navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        HandleUser();

        const interval = setInterval(() => {
            toast.success(t("retrying"), { icon: <Info className="w-6 h-6" /> });
            HandleUser();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Page back={false}>
            <main className="bg-primary flex items-center justify-center flex-1 h-full max-w-xl">
                <div className="flex flex-col w-1/3 gap-4">
                    <Lottie animationData={fireAnimation} loop />
                </div>
            </main>
        </Page>
    );
};
