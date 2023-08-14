import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

export default function checkUpdate(window: BrowserWindow) {
  autoUpdater.setFeedURL(
    "https://github.com/Archean-wang/ForU/releases/latest/download"
  );
  autoUpdater.autoDownload = false;

  ipcMain.handle("check-update", async function () {
    console.log("???");
    return await autoUpdater.checkForUpdates();
  });

  autoUpdater.on("error", function (_error, message) {
    window.webContents.send("update-error", message);
  });

  autoUpdater.on("update-available", function (info) {
    window.webContents.send("updat-available", info);
  });

  autoUpdater.on("download-progress", function (info) {
    window.webContents.send("download-progress", info);
  });

  autoUpdater.on("update-downloaded", function () {
    window.webContents.send("update-downloaded");
    ipcMain.on("update-now", () => {
      autoUpdater.quitAndInstall();
    });
  });
}
