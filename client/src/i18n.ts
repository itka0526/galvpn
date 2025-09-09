import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../../locales/en/translation.json";
import ru from "../../locales/ru/translation.json";
import mn from "../../locales/mn/translation.json";

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    load: "languageOnly",
    interpolation: { escapeValue: false },
    resources: {
        en: { translation: en },
        ru: { translation: ru },
        mn: { translation: mn },
    },
    debug: import.meta.env.DEV,
});

export default i18n;
