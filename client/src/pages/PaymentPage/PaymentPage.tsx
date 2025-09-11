import { type FC } from "react";
import { Page } from "@/components/Page.tsx";
import { globalConfig } from "@shared/globalConfig";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { AccountDetails } from "./AccountDetails";
import { CheckPaymentButton } from "./CheckPaymentButton";
import { useTranslation } from "react-i18next";

export const PaymentPage: FC = () => {
    const { tgWebAppData } = retrieveLaunchParams();
    const userID = tgWebAppData?.user?.id ?? "MGLZ";
    const { t } = useTranslation();
    return (
        <Page back={true}>
            <main className="pt-28 flex flex-col items-center justify-center flex-1 w-full max-w-xl gap-4 p-4">
                <h1 className="text-2xl font-bold text-center text-white">Payment </h1>
                <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4 space-x-3">
                        <p className="text-pretty text-sm text-center text-blue-400">
                            {t("pay.p1")}
                            <span className="text-red-400">{globalConfig.paymentAmountPerMonth}</span> {t("pay.p2")}
                            <br />
                            {t("pay.p3")} "<span className="text-red-400">{userID}</span>" {t("pay.p4")}
                            <br />
                            <br />
                            <span className="text-red-400">
                                ({globalConfig.bankType}) <AccountDetails content={globalConfig.accountDetails} />
                            </span>
                            <br />
                            <br />
                            <CheckPaymentButton />
                            <br />
                            <br />
                            <em>{t("pay.p5")}</em>
                        </p>
                        <a
                            href={`${globalConfig.telegram}`}
                            target="_blank"
                            className="hover:text-blue-200 flex text-sm text-blue-300 transition-colors"
                        >
                            {globalConfig.telegram}
                        </a>
                    </div>
                </div>
            </main>
        </Page>
    );
};
