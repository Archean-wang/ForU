import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../store";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "../i18n";

const configContext = createContext({
  exitToTray: true,
  version: "",
  updateCheckResult: null,
  proxy: "",
  language: "en",
});

function Config({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState(null);

  const store = useStore();
  useEffect(() => {
    if (!config) {
      window.electronAPI.getSettings().then((res) => {
        store.settingsStore.setSettings(res);
        i18next.use(initReactI18next).init({
          resources,
          lng: res.language,
          fallbackLng: "en",
        });
        setConfig(res);
      });
    }
  }, [config]);

  return config ? (
    <configContext.Provider value={config}>{children}</configContext.Provider>
  ) : (
    <></>
  );
}

export default Config;

export function useConfig() {
  return useContext(configContext);
}
