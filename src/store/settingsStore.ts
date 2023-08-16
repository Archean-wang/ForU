import { UpdateCheckResult } from "electron-updater";
import { makeAutoObservable } from "mobx";

interface Settings {
  exitToTray: boolean;
  version: string;
  updateCheckResult: UpdateCheckResult | null;
  proxy: string;
}

export class SettingsStore {
  settings: Settings = {
    exitToTray: true,
    version: "",
    updateCheckResult: null,
    proxy: "",
  };
  constructor() {
    makeAutoObservable(this);
  }

  setSettings(settings: Settings) {
    this.settings = settings;
  }

  setExitToTray(value: boolean) {
    this.settings.exitToTray = value;
    window.electronAPI.setSettings("exitToTray", value);
  }

  setUpdateInfo(value: UpdateCheckResult) {
    this.settings.updateCheckResult = value;
  }

  setProxy(value: string) {
    this.settings.proxy = value;
    window.electronAPI.setSettings("proxy", value);
  }

  get updateAvailable() {
    if (!this.settings.updateCheckResult) return false;
    return (
      this.settings.updateCheckResult?.versionInfo.version !==
      this.settings.updateCheckResult?.updateInfo.version
    );
  }
}

export default new SettingsStore();
