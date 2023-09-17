import {
  BrowserWindow,
  app,
  ipcMain,
  shell,
  components,
  Tray,
  Menu,
  globalShortcut,
  IpcMainEvent,
} from "electron";
import path from "path";
import express from "express";
import appIcon from "../../build/icon.png?asset";
import { CancellationToken, autoUpdater } from "electron-updater";
import config from "../config";
import initI18n from "../i18n";
import i18next from "i18next";

config.set("version", app.getVersion());
initI18n(config.get("language") as string);

let paused = true;
let window: null | BrowserWindow = null;

const action = {
  previous: () => window?.webContents.send("tray-previous"),
  toggle: () => window?.webContents.send("tray-toggle"),
  next: () => window?.webContents.send("tray-next"),
  toggleShow: () => {
    if (!window) return;
    if (window.isVisible()) {
      window.hide();
      window.setSkipTaskbar(true);
    } else {
      window.show();
    }
  },
  volumeAdd: () => window?.webContents.send("volume-add"),
  volumeSub: () => window?.webContents.send("volume-sub"),
};

// shortcuts
const createWindowMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: "control",
      submenu: [
        {
          label: "toggle",
          accelerator: "Space",
          click: action.toggle,
        },
        {
          label: "previous",
          accelerator: "Left",
          click: action.previous,
        },
        {
          label: "next",
          accelerator: "Right",
          click: action.next,
        },
        {
          label: "volumeUp",
          accelerator: "Up",
          click: action.volumeAdd,
        },
        {
          label: "volumeDonw",
          accelerator: "Down",
          click: action.volumeSub,
        },
      ],
    },
    {
      label: "devTool",
      accelerator: "Alt+CommandOrControl+I",
      click: () => window?.webContents.openDevTools(),
    },
  ]);
  Menu.setApplicationMenu(menu);
};

const createWindow = () => {
  window = new BrowserWindow({
    icon: appIcon,
    title: "ForU",
    width: 960,
    height: 720,
    minWidth: 960,
    minHeight: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  const server = express();
  server.get("/callback", (req, res) => {
    const code = req.query.code;
    window?.webContents.send("code-ready", code);
    res.send(i18next.t("loginSuccessfully"));
  });
  server.listen(12138);

  ipcMain.on("open-url", (_event: IpcMainEvent, url: string) => {
    shell.openExternal(url);
  });

  // 加载页面
  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    window.webContents.openDevTools();
  } else {
    window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  // 退出最小化到托盘
  window.on("close", (event) => {
    if (config.get("exitToTray")) {
      event.preventDefault();
      window?.hide();
      window?.setSkipTaskbar(true);
    }
  });
};

const createTrayMenu = () =>
  Menu.buildFromTemplate([
    {
      label: i18next.t("previous"),
      click: action.previous,
    },
    {
      label: paused ? i18next.t("play") : i18next.t("pause"),
      click: action.toggle,
    },
    {
      label: i18next.t("next"),
      click: action.next,
    },
    {
      label: i18next.t("exit"),
      click: () => {
        window?.destroy();
      },
    },
  ]);

let tray: Tray;

const createTray = () => {
  tray = new Tray(appIcon);
  tray.setToolTip("Foru");
  tray.setTitle("Foru");
  tray.on("click", action.toggleShow);
  ipcMain.on("is-paused", (_event, status) => {
    paused = status;
    tray.setContextMenu(createTrayMenu());
  });
  tray.setContextMenu(createTrayMenu());
};

// proxy
if (config.get("proxy")) {
  app.commandLine.appendSwitch("proxy-server", `${config.get("proxy")}`);
}

app.whenReady().then(async () => {
  await components.whenReady();
  console.log("components ready:", components.status());
  globalShortcut.register("Alt+CommandOrControl+S", action.toggleShow);

  ipcMain.handle("get-setting", (_event, key) => config.get(key));
  ipcMain.handle("set-settings", (_event, key, value) => {
    config.set(key, value);
    if (key === "language") {
      i18next.changeLanguage(value);
      tray.setContextMenu(createTrayMenu());
    }
  });
  ipcMain.handle("get-settings", (_event) => {
    return config.store;
  });

  createWindow();
  createWindowMenu();
  createTray();
  checkUpdate();
});

let cancellationToken: undefined | CancellationToken;

function checkUpdate() {
  autoUpdater.setFeedURL(
    "https://github.com/Archean-wang/ForU/releases/latest/download"
  );
  autoUpdater.autoDownload = false;

  ipcMain.handle("check-update", async function () {
    const res = await autoUpdater.checkForUpdates();
    cancellationToken = res?.cancellationToken;
    return res;
  });

  ipcMain.handle("update-download", async function (_event) {
    await autoUpdater.downloadUpdate(cancellationToken);
  });

  autoUpdater.on("error", function (_error, message) {
    window?.webContents.send("update-error", message);
  });

  autoUpdater.on("update-available", function (info) {
    window?.webContents.send("updat-available", info);
  });

  autoUpdater.on("download-progress", function (info) {
    window?.webContents.send("download-progress", info);
  });

  autoUpdater.on("update-downloaded", function () {
    window?.webContents.send("update-downloaded");
    ipcMain.on("update-now", () => {
      autoUpdater.quitAndInstall();
    });
  });
}
