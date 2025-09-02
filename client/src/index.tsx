// Include Telegram UI styles first to allow our code override the package CSS.
import "@telegram-apps/telegram-ui/dist/styles.css";

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { isLaunchParamsRetrieveError, isTMA, retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { Root } from "@/components/Root.tsx";
import { EnvUnsupported } from "@/components/EnvUnsupported.tsx";
import { init } from "@/init.ts";

import "./index.css";
import config from "./config";
import { generateMockEnv } from "./mockEnv";

const root = ReactDOM.createRoot(document.getElementById("root")!);

try {
    // Mock the environment in case, we are outside Telegram.
    await generateMockEnv();
    // If not TMA just redirect user to Telegram Bot only in production
    if (!isTMA() && import.meta.env.PROD) {
        window.location.href = config.botLink;
    }
    const launchParams = retrieveLaunchParams();
    const { tgWebAppPlatform: platform } = launchParams;
    const debug = (launchParams.tgWebAppStartParam || "").includes("platformer_debug") || import.meta.env.DEV;

    // Configure all application dependencies.
    await init({
        debug,
        eruda: debug && ["ios", "android"].includes(platform),
        mockForMacOS: platform === "macos",
    }).then(() => {
        root.render(
            <StrictMode>
                <Root />
            </StrictMode>
        );
    });
} catch (e) {
    if (isLaunchParamsRetrieveError(e)) {
        window.location.href = config.botLink;
    }
    root.render(<EnvUnsupported />);
}
