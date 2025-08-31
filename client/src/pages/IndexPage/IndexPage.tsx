import { useEffect, type FC } from "react";
import { Page } from "@/components/Page.tsx";
import { HttpStatusCode } from "axios";
import Lottie from "lottie-react";
import fireAnimation from "../../../assets/fire.json";
import { useNavigate } from "react-router-dom";
import myAxios from "@/myAxios";

export const IndexPage: FC = () => {
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
    }, []);

    return (
        <Page back={false}>
            <main className="bg-primary flex items-center justify-center flex-1 h-full">
                <div className="flex flex-col w-1/3 gap-4">
                    <Lottie animationData={fireAnimation} loop />
                    {/* TODO: i18 */}
                    <h2 className="ml-2 text-lg text-center text-gray-300">Please wait...</h2>
                </div>
            </main>
        </Page>
    );
};
