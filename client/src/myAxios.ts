import axios, { HttpStatusCode } from "axios";
import { closeMiniApp, retrieveRawInitData } from "@telegram-apps/sdk";
import config from "./config";
import toast from "react-hot-toast";
import { generateMockEnv } from "./mockEnv";

// Set config defaults when creating the instance
const myAxios = axios.create({
    baseURL: config.BACKEND_ENDPOINT_ADDR,
    withCredentials: true,
});

try {
    if (import.meta.env.DEV) {
        await generateMockEnv();
        const initDataRaw = retrieveRawInitData();
        myAxios.defaults.headers.common["Authorization"] = `tma ${initDataRaw}`;
    }
} catch {}

// TMA authorization

myAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === HttpStatusCode.ImATeapot) {
            toast.success(`${error.response.data?.message ?? "🤯"}`, { duration: 2000 });
            setTimeout(() => {
                closeMiniApp();
            }, 2500);
        }
        return Promise.reject(error);
    }
);

export default myAxios;
