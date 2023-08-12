import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
interface Callback {
  (event: IpcRendererEvent): void;
}

contextBridge.exposeInMainWorld("electronAPI", {
  onCodeReady: (cb: (event: IpcRendererEvent, code: string) => void) =>
    ipcRenderer.on("code-ready", cb),
  openURL: (url: string) => ipcRenderer.send("open-url", url),
  onToggle: (cb: Callback) => ipcRenderer.on("tray-toggle", cb),
  onNext: (cb: Callback) => ipcRenderer.on("tray-next", cb),
  onPrevious: (cb: Callback) => ipcRenderer.on("tray-previous", cb),
  sendStatus: (puased: boolean) => ipcRenderer.send("is-paused", puased),
  removeAllListeners: (name: string) => ipcRenderer.removeAllListeners(name),
  onVolumeAdd: (cb: Callback) => ipcRenderer.on("volume-add", cb),
  onVolumeSub: (cb: Callback) => ipcRenderer.on("volume-sub", cb),
  getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setSettings: (key: string, value: any) =>
    ipcRenderer.invoke("set-settings", key, value),
});
