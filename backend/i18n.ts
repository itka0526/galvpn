import i18next from "i18next";
import i18NexFsBackend from "i18next-fs-backend";
import i18Middleware from "i18next-http-middleware";
import path from "path";
// import config from "./config";

i18next
    .use(i18NexFsBackend)
    .use(i18Middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        load: "languageOnly",
        backend: {
            loadPath: path.resolve(process.cwd(), "../locales/{{lng}}/{{ns}}.json"),
        },
        preload: ["en", "ru", "mn"],
        // debug: config.nodeEnv === "development" ,
    });

export { i18Middleware, i18next };
