import { makeAutoObservable } from "mobx";

interface Settings {
  exitToTray: boolean;
}

export class SettingsStore {
  settings: Settings = {
    exitToTray: true,
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
}

export default new SettingsStore();