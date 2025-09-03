import { useMemo } from "react";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { routes } from "@/navigation/routes.tsx";

export function App() {
    const lp = useMemo(() => retrieveLaunchParams(), []);
    return (
        <AppRoot
            className="bg-black/95 flex flex-col items-center w-full min-h-full pt-20"
            appearance={"dark"}
            platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
        >
            <div className="flex flex-col w-full max-w-xl min-h-full">
                <HashRouter>
                    <Routes>
                        {routes.map((route) => (
                            <Route key={route.path} {...route} />
                        ))}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </HashRouter>
            </div>
        </AppRoot>
    );
}
