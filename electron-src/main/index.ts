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
import Conf from "conf";
import { autoUpdater } from "electron-updater";

const schema = {
  exitToTray: {
    type: "boolean",
    default: true,
  },
  cleintId: {
    type: "string",
    default: "",
  },
  version: {
    type: "string",
    default: app.getVersion(),
  },
};

const config = new Conf({ projectName: "foru", schema });

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
    res.send("登录成功");
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
      label: "上一首",
      click: action.previous,
    },
    {
      label: paused ? "播放" : "暂停",
      click: action.toggle,
    },
    {
      label: "下一首",
      click: action.next,
    },
    {
      label: "退出",
      click: () => {
        window?.destroy();
      },
    },
  ]);

const createTray = () => {
  const tray = new Tray(appIcon);
  tray.setToolTip("Foru");
  tray.setTitle("Foru");
  tray.on("click", action.toggleShow);
  ipcMain.on("is-paused", (_event, status) => {
    paused = status;
    tray.setContextMenu(createTrayMenu());
  });
  tray.setContextMenu(createTrayMenu());
};

app.whenReady().then(async () => {
  await components.whenReady();
  console.log("components ready:", components.status());
  globalShortcut.register("Alt+CommandOrControl+S", action.toggleShow);

  ipcMain.handle("get-setting", (_event, key) => config.get(key));
  ipcMain.handle("set-settings", (_event, key, value) => {
    config.set(key, value);
  });
  ipcMain.handle("get-settings", (_event) => {
    return config.store;
  });

  createWindow();
  createWindowMenu();
  createTray();
  checkUpdate();
});

function checkUpdate() {
  autoUpdater.setFeedURL(
    "https://github.com/Archean-wang/ForU/releases/latest/download"
  );
  autoUpdater.autoDownload = false;

  ipcMain.handle("check-update", async function () {
    const res = await autoUpdater.checkForUpdatesAndNotify();
    console.log(res)
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
