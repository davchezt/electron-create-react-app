const electron = require("electron");
const app = electron.app;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

// Deep linked url
let deeplinkingUrl

require("update-electron-app")({
  repo: "kitze/react-electron-example",
  updateInterval: "1 hour"
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Protocol handler for win32
  // commandLine: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform == 'win32') {
      // Keep only command line / deep linked arguments
      deeplinkingUrl = commandLine.slice(1);
    }
    logEverywhere("app.makeSingleInstance# " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);

    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create mainWindow, load the rest of the app, etc...
  app.on("ready", () => {
    createWindow();
    const ret = globalShortcut.register('CommandOrControl+R', () => {
      console.log('CommandOrControl+R is pressed');
      mainWindow.reload();
    })
  
    if (!ret) {
      console.log('registration failed')
    }
    // Check whether a shortcut is registered.
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

  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('harmony');

  // Protocol handler for osx
  app.on('open-url', function (event, url) {
    event.preventDefault();
    deeplinkingUrl = url;
    logEverywhere("open-url# " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
  });

  app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680
  });
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
  mainWindow.webContents.openDevTools({mode:'undocked'});

  // Protocol handler for win32
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1);
  }
  logEverywhere("createWindow# " + deeplinkingUrl);
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
  })

  mainWindow.on("closed", () => (mainWindow = null));
}

// Log both at dev console and at running node console instance
function logEverywhere(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}