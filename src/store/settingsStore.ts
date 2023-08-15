import { UpdateInfo } from "electron-updater";
import { makeAutoObservable } from "mobx";

interface Settings {
  exitToTray: boolean;
  version: string;
  updateInfo: UpdateInfo | null;
  proxy: string;
}

export class SettingsStore {
  settings: Settings = {
    exitToTray: true,
    version: "",
    updateInfo: null,
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

  setUpdateInfo(value: UpdateInfo) {
    this.settings.updateInfo = value;
  }

  setProxy(value: string) {
    this.settings.proxy = value;
    window.electronAPI.setSettings("proxy", value);
  }
}

export default new SettingsStore();
