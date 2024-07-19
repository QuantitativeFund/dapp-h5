import { createI18n } from "vue-i18n";
import zh from "../lang/zh";
import en from "../lang/en";

const i18n = createI18n({

  legacy: false,
  globalInjection: true,
  //locale: localStorage.getItem('locale') || navigator.language.slice(0, 2),
  locale: navigator.language == "zh-CN" ? "zh" : navigator.language,
  fallbackLocale: "en",
  messages: {
    zh: zh,
    en: en,
  },
});

export default i18n;
