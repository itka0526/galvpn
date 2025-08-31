import { InitData } from "@telegram-apps/init-data-node";
import { CustomResponse } from "./types";

// We setting this data, so we can use it for further use into the code, well after this middleware runs.
function setInitData(res: CustomResponse, initData: InitData): void {
    res.locals.initData = initData;
}

function getInitData(res: CustomResponse): InitData | undefined {
    return res.locals.initData;
}

export { setInitData, getInitData };
