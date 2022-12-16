import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./en.json";
import plTranslation from "./pl.json";

export const availableLangs = ["en", "pl"];
export const defaultLang = "en";

const defaultNS = "translation";
const resources = {
    en: {
        translation: enTranslation,
    },
    pl: {
        translation: plTranslation,
    },
} as const;

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources["en"];
    }
}

export function init() {
    i18n
        .use(initReactI18next)
        .use(LanguageDetector)
        .init({
            ns: ["translation"],
            defaultNS,
            resources,
            fallbackLng: defaultLang,
            interpolation: {
                escapeValue: false,
            },
        });
}
