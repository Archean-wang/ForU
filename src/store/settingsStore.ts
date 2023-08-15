import { UpdateInfo } from "electron-updater";
import { makeAutoObservable } from "mobx";

interface Settings {
  exitToTray: boolean;
  version: string;
  updateInfo: UpdateInfo | null
}

export class SettingsStore {
  settings: Settings = {
    exitToTray: true,
    version: "",
    updateInfo: null
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
    this.settings.updateInfo = value
  }
}

export default new SettingsStore();
