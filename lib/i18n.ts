import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { en, fr, hi } from "./i18nLanguages";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  hi: {
    translation: hi,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
