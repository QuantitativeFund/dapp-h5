import { createI18n } from "vue-i18n";
import zh from "../lang/zh";
import en from "../lang/en";
import vi from "../lang/vi";
import ko from "./ko";
import th from "./th";
import ms from "./ms";
const i18n = createI18n({
   //支持组合式API
  legacy: false, 
  // 让 template 可以像 vue2 那样使用 $t 来访问
  globalInjection: true,
  // 如果本地有语言标识就采用本地，没有就根据浏览器语言默认标识显示语言
  //locale: localStorage.getItem('locale') || navigator.language.slice(0, 2),
  locale: navigator.language == "zh-CN" ? "zh" : navigator.language,
  // 没有英文的时候默认中文语言
  fallbackLocale: "en",
  messages: {
    zh: zh,
    en: en,
    vi: vi,
    ko: ko,
    th: th,
    ms: ms
  },
});

export default i18n;
