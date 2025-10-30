import http2, { ClientSessionOptions, OutgoingHttpHeaders, SecureClientSessionOptions } from "http2";
import { gunzipSync } from "zlib";
import config from "../config";
import { reportError } from "../bot/reportError";
import { bot } from "../bot/bot";

type POSTArgs = {
    url: string;
    path: string;
    agentOpts: ClientSessionOptions | SecureClientSessionOptions;
    body: {
        current_geo: {
            lat: number;
            lon: number;
        };
        lat: number;
        lon: number;
        sort: "recommended" | string;
        start_date: string;
        timezone: "Europe/Moscow" | string;
    };
    extraHeaderConfig: OutgoingHttpHeaders | readonly string[] | undefined;
};

type ShiftData = {
    sort: "recommended" | "start_time" | "distance";
    sort_options: {
        key: string;
        title: string;
        subtitle?: string;
    }[];
    items: {
        item_ids: {
            type: string;
            id: string;
        }[];
        accepted_shifts: any[];
        available_shifts: {
            id: string;
            batch_id: string;
            category: string;
            organization: {
                id: string;
                name: string;
                logo_url: string;
            };
            address: {
                street: string;
                lat: number;
                lon: number;
                distance: number;
            };
            profession_name: string;
            start_time: string;
            length: number;
            state: string;
            payment_value: string;
            temp_raw_payment_value: number;
            payment_color: string;
            payment_subtitle: string;
        }[];
        site_feedback_widgets: any[];
        reward_status_widgets: {
            id: string;
            title: string;
            subtitle: string;
            icon_url: string;
            reward_text: string;
            current_progress: number;
            target_progress: number;
            deeplink: string;
        }[];
    };
    sites_exist: boolean;
    prev_page_token: string | null;
    next_page_token: string | null;
};

const POST = ({ url, path, body, agentOpts, extraHeaderConfig }: POSTArgs): Promise<ShiftData> =>
    new Promise((resolve, reject) => {
        const client = http2.connect(url, agentOpts);

        const buffer = Buffer.from(JSON.stringify(body));

        const req = client.request({
            ...extraHeaderConfig,
            [http2.constants.HTTP2_HEADER_SCHEME]: "https",
            [http2.constants.HTTP2_HEADER_METHOD]: http2.constants.HTTP2_METHOD_POST,
            [http2.constants.HTTP2_HEADER_PATH]: `${path}`,
            "Content-Type": "application/json",
            "Content-Length": buffer.length,
        });

        let data: Uint8Array<ArrayBufferLike>[] = [];

        req.on("response", (headers) => {
            console.log("Response headers:", headers);
        });

        req.on("data", (chunk) => data.push(chunk));

        req.on("end", async () => {
            try {
                let fullData = Buffer.concat(data);
                const unzippedFullData = gunzipSync(fullData);
                const jsonData = JSON.parse(unzippedFullData.toString("utf8"));
                resolve(jsonData);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }
        });

        req.on("error", (error) => {
            reject(error);
            client.close();
        });

        req.write(buffer);
        req.end();
    });

export const findJobsAbove400 = async () => {
    const { YNDX_URL, YNDX_DEVICE_ID, YNDX_PARK_ID, YNDX_X_DRIVER_SESSION, YNDX_AUTH_TOKEN, YNDX_X_MOB_ID, adminID } = config;

    const INTERESTED_PAY = 400;

    if (!YNDX_URL || !YNDX_DEVICE_ID || !YNDX_PARK_ID || !YNDX_X_DRIVER_SESSION || !YNDX_AUTH_TOKEN || !YNDX_X_MOB_ID) {
        reportError("Missing yandex smena parameters. Please check environment variables.");
        return;
    }

    const path = `/driver/v1/blue-collars/v6/shifts/list?device_id=${YNDX_DEVICE_ID}&park_id=${YNDX_PARK_ID}&mobcf=russia%25yandex_pro_ru_0%25default&mobpr=yandex_pro_ru_0_Y_BASE_API_0`;

    const mapCoords = { lat: 55.670589, lon: 37.5108 }; // Ugo-Zapadnaya

    const dateNow = new Date()
        .toLocaleString("en-CA", {
            timeZone: "Europe/Moscow",
        })
        .split(",")[0];

    if (!dateNow) {
        reportError("Date missing from body!", "YANDEX SMENA ERROR");
        return;
    }

    const body = {
        current_geo: mapCoords,
        ...mapCoords,
        sort: "recommended",
        start_date: dateNow,
        timezone: "Europe/Moscow",
    };

    const headers = {
        accept: "application/json",
        "user-agent": "app:pro brand:smena version:93.73 build:23424 platform:ios platform_version:18.1.1",
        version: "93.73.02",
        "accept-language": "ru",
        "x-driver-session": YNDX_X_DRIVER_SESSION,
        authorization: YNDX_AUTH_TOKEN,
        "x-yataxi-last-zone-names": "moscow",
        host: "taximeter.yandex.rostaxi.org",
        "x-mob-id": YNDX_X_MOB_ID,
        "accept-encoding": "gzip",
    };

    try {
        const res = await POST({
            url: YNDX_URL,
            path,
            body,
            agentOpts: { rejectUnauthorized: false, checkServerIdentity: () => undefined },
            extraHeaderConfig: headers,
        });

        const filteredJobs = res.items.available_shifts.filter(
            // Length = minutes, temp_raw_payment_value = shift pay * 100
            ({ temp_raw_payment_value, length }) => temp_raw_payment_value / 100 / (length / 60) >= INTERESTED_PAY
        );

        const formatedJobs = filteredJobs.map(
            ({ payment_subtitle, payment_value, length, organization, start_time, state, profession_name, address }) => {
                const date = new Date(start_time);
                const moscowTime = date.toLocaleString("en-US", { timeZone: "Europe/Moscow", hour12: false });

                return `
ℹ️ <b>${profession_name}</b>
🏢 <b>${organization.name}</b>
⏳ ${moscowTime}
📍 ${address}
💰 <b>${payment_subtitle} x ${length / 60}ч = ${payment_value}</b>
${state === "available" ? "🟢 Открыта" : "🔴 Закрыта"}
            `;
            }
        );

        // No jobs right now.
        if (formatedJobs.length === 0) {
            return;
        }

        const usersToNotify = [adminID];

        for (const telegramId of usersToNotify) {
            await bot.api.sendMessage(telegramId, formatedJobs.join("\n"), { parse_mode: "HTML" });

            await new Promise((res) => setTimeout(res, 2500));
        }
    } catch (err) {
        reportError(err, "YANDEX SMENA ERROR");
    } finally {
        return;
    }
};
