import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onCodeReady: (cb) => ipcRenderer.on("code-ready", cb),
  openURL: (url: string) => ipcRenderer.send("open-url", url),
});
