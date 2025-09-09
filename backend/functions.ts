import { InitData } from "@telegram-apps/init-data-node";
import { CustomResponse } from "./types";
import { TFunction } from "i18next";

// We setting this data, so we can use it for further use into the code, well after this middleware runs.
function setInitData(res: CustomResponse, initData: InitData): void {
    res.locals.initData = initData;
}

function getInitData(res: CustomResponse): InitData | undefined {
    return res.locals.initData;
}

function extractClientName(configFilePath: string, t: TFunction<"translation", undefined>) {
    const matchClientName = /user-[^\.]+/gi;

    const matches = matchClientName.exec(configFilePath);

    if (matches && matches.length) {
        return matches[0];
    } else {
        throw Error(t("client_not_found"));
    }
}

export { setInitData, getInitData, extractClientName };
