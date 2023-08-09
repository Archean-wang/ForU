import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onCodeReady: (cb) => ipcRenderer.on("code-ready", cb),
  openURL: (url: string) => ipcRenderer.send("open-url", url),
  onToggle: (cb) => ipcRenderer.on("tray-toggle", cb),
  onNext: (cb) => ipcRenderer.on("tray-next", cb),
  onPrevious: (cb) => ipcRenderer.on("tray-previous", cb),
  sendStatus: (puased: boolean) => ipcRenderer.send("is-paused", puased),
  removeAllListeners: (name) => ipcRenderer.removeAllListeners(name),
  onVolumeAdd: (cb) => ipcRenderer.on("volume-add", cb),
  onVolumeSub: (cb) => ipcRenderer.on("volume-sub", cb),
});
