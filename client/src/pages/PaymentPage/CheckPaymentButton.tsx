import { Button } from "@/components/ui/button";
import myAxios from "@/myAxios";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function CheckPaymentButton() {
    const checkPayment = async () => {
        const resp = await myAxios.post<{ message: string }>("/payment");
        if (resp.status === HttpStatusCode.Ok) {
            toast.success(resp.data.message);
        } else {
            toast.error(resp.data.message);
        }
    };

    const { t } = useTranslation();

    return (
        <Button variant={"secondary"} onClick={checkPayment}>
            {t("check")}
        </Button>
    );
}
