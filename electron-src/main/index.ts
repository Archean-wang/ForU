import {
  BrowserWindow,
  app,
  ipcMain,
  shell,
  components,
  Tray,
  Menu,
  nativeImage,
} from "electron";
import path from "path";
import express from "express";
import appIcon from "../../resources/logo.png?asset";

const createWindow = () => {
  const window = new BrowserWindow({
    icon: appIcon,
    title: "ForU",
    width: 960,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  const server = express();
  server.get("/callback", (req, res) => {
    const code = req.query.code;
    window.webContents.send("code-ready", code);
    res.send("登录成功");
  });
  server.listen(12138);

  ipcMain.on("open-url", (_event, url) => {
    shell.openExternal(url);
  });

  // 加载页面
  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    window.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  window.on("close", (event) => {
    event.preventDefault();
    window.hide();
    window.setSkipTaskbar(true);
  });
  return window;
};

const createTray = (window: BrowserWindow) => {
  const tray = new Tray(appIcon);
  tray.setToolTip("Foru");
  tray.setTitle("Foru");
  tray.on("click", () => {
    window.show();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "退出",
      click: () => {
        window.destroy();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

app.whenReady().then(async () => {
  await components.whenReady();
  console.log("components ready:", components.status());
  const window = createWindow();
  createTray(window);
});
