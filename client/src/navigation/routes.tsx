import type { ComponentType, JSX } from "react";

import { IndexPage } from "@/pages/IndexPage/IndexPage";
import { DashboardPage } from "@/pages/DashboardPage/DashboardPage";
import { PaymentPage } from "@/pages/PaymentPage/PaymentPage";
import { ReferPage } from "@/pages/ReferPage/ReferPage";

interface Route {
    path: string;
    Component: ComponentType;
    title?: string;
    icon?: JSX.Element;
}

export const routes: Route[] = [
    { path: "/", Component: IndexPage },
    { path: "/dashboard", Component: DashboardPage },
    { path: "/payment", Component: PaymentPage },
    { path: "/refer", Component: ReferPage },
];
