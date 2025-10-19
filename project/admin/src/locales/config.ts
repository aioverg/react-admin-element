import { initReactI18next } from "react-i18next";
import {
  getZhLang,
  getEnLang,
  getVnLang,
  getZhLangNamespaces,
  getEnLangNamespaces,
  getVnLangNamespaces,
} from "./utils/helper";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { globalConfig } from "@packages/utils";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // debug: true, // 在控制台输出语言信息
    lng: localStorage.getItem("lang") || globalConfig.DEFAULT_LANG, // 默认语言
    interpolation: {
      escapeValue: false,
    },
    resources: {
      zh: {
        translation: getZhLang(),
        ...getZhLangNamespaces(),
      },
      en: {
        translation: getEnLang(),
        ...getEnLangNamespaces(),
      },
      vn: {
        translation: getVnLang(),
        ...getVnLangNamespaces(),
      },
    },
  });

export default i18n;
