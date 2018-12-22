const electron = require("electron");
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

let deeplinkingUrl

require("update-electron-app")({
  repo: "davchezt/electron-create-react-app",
  updateInterval: "1 hour"
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (process.platform == 'win32') {
      deeplinkingUrl = commandLine.slice(1);
    }
    logEverywhere("second-instance: " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on("ready", () => {
    createWindow();
    const ret = globalShortcut.register('CommandOrControl+R', () => {
      console.log('CommandOrControl+R is pressed');
      mainWindow.reload();
    })
  
    if (!ret) {
      console.log('registration failed')
    }
    console.log(globalShortcut.isRegistered('CommandOrControl+R'))
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.setAsDefaultProtocolClient('harmony');

  app.on('open-url', function (event, url) {
    event.preventDefault();
    deeplinkingUrl = url;
    logEverywhere("open-url: " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
  mainWindow.webContents.openDevTools({mode:'undocked'});

  if (process.platform == 'win32') {
    deeplinkingUrl = process.argv.slice(1);
  }
  logEverywhere("createWindow: " + deeplinkingUrl);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
  })

  mainWindow.on("closed", () => (mainWindow = null));
}

function logEverywhere(s) {
  console.log(s);
  if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(`console.log("${s}")`);
  }
}