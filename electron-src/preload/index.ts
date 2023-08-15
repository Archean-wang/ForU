import { contextBridge, ipcRenderer } from "electron";

interface Listener {
  (event: Electron.IpcRendererEvent, ...args: any[]): void;
}

contextBridge.exposeInMainWorld("electronAPI", {
  removeAllListeners: (name: string) => ipcRenderer.removeAllListeners(name),
  // login code
  onCodeReady: (cb: Listener) =>
    ipcRenderer.on("code-ready", cb),
  // operations
  openURL: (url: string) => ipcRenderer.send("open-url", url),
  //playback control
  sendStatus: (puased: boolean) => ipcRenderer.send("is-paused", puased),
  onToggle: (cb: Listener) => ipcRenderer.on("tray-toggle", cb),
  onNext: (cb: Listener) => ipcRenderer.on("tray-next", cb),
  onPrevious: (cb: Listener) => ipcRenderer.on("tray-previous", cb),
  onVolumeAdd: (cb: Listener) => ipcRenderer.on("volume-add", cb),
  onVolumeSub: (cb: Listener) => ipcRenderer.on("volume-sub", cb),
  // settings
  getSetting: (key: string) => ipcRenderer.invoke("get-setting", key),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  setSettings: (key: string, value: any) =>
    ipcRenderer.invoke("set-settings", key, value),
  // update
  checkUpdate: () => ipcRenderer.invoke("check-update"),
  updateDownload: () => ipcRenderer.invoke("update-download"),
  updateNow: () => ipcRenderer.send("update-now"),
  onUpdateError: (cb: Listener) => ipcRenderer.on("update-error", cb),
  onUpdatAvailable: (cb: Listener) => ipcRenderer.on("updat-available", cb),
  onDownloadProgress: (cb: Listener) => ipcRenderer.on("download-progress", cb),
  onUpdatDownloaded: (cb: Listener) => ipcRenderer.on("update-downloaded", cb),
});
