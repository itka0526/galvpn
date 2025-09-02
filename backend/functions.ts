import { InitData } from "@telegram-apps/init-data-node";
import { CustomResponse } from "./types";

// We setting this data, so we can use it for further use into the code, well after this middleware runs.
function setInitData(res: CustomResponse, initData: InitData): void {
    res.locals.initData = initData;
}

function getInitData(res: CustomResponse): InitData | undefined {
    return res.locals.initData;
}

function extractClientName(configFilePath: string) {
    const matchClientName = /user-[^\.]+/gi;

    const matches = matchClientName.exec(configFilePath);

    if (matches && matches.length) {
        return matches[0];
    } else {
        // TODO: i18
        throw Error("Client name not found.");
    }
}

export { setInitData, getInitData, extractClientName };
