import i18next from "i18next";
import en_US from "./en_US";
import zh_CN from "./zh_CN";

const resources = {
  en: {
    translation: en_US,
  },
  zh: {
    translation: zh_CN,
  },
};

export default function initI18n(lng: string) {
  i18next.init({
    resources,
    lng: lng,
    fallbackLng: "en",
  });
}
