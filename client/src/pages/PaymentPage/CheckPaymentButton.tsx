import { Button } from "@/components/ui/button";
import myAxios from "@/myAxios";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";

export function CheckPaymentButton() {
    const checkPayment = async () => {
        const resp = await myAxios.post<{ message: string }>("/payment");
        if (resp.status === HttpStatusCode.Ok) {
            toast.success(resp.data.message);
        } else {
            toast.error(resp.data.message);
        }
    };

    return (
        <Button variant={"secondary"} onClick={checkPayment}>
            {/* TODO: i18 */}
            I've paid
        </Button>
    );
}
