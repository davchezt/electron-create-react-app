import React, { Component } from 'react';
import Electron from 'electron';
import Notifier from 'node-notifier';
import path from 'path';
import fs from 'fs';

import ImageNotif from './coulson.jpg';
import logo from './logo.svg';
import './App.css';

// const { dialog } = Electron.remote;
const { BrowserWindow, ipcMain, ipcRenderer, Notification, remote } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
const { app } = remote;

const { WindowsToaster, WindowsBalloon } = Notifier;

const assetsLocation = process.env.NODE_ENV == "development" ?
  path.resolve(path.join(__dirname, "../build/assets")) :
  path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked/assets'));

class App extends Component {
  constructor(props) {
    super(props);

    //console.log("process.cwd()", process.cwd());
    //console.log("app.getAppPath()", app.getAppPath().replace('app.asar', 'app.asar.unpacked'));
    //console.log("process.execPath", process.execPath);
    //console.log("process.env.PUBLIC_URL", process.env.PUBLIC_URL);
    console.log(process.resourcesPath);
  }
  init() {
    ipcRenderer.on("harmony-url", (event, message) => {
      if (message.length !== 0) {
        if (message[0].length > 1) {
          let urlPath = message[0].split(":/")[1];
          urlPath = urlPath.toString().substring(1, urlPath.length - 1);
          console.log("/" + urlPath);
          let router = urlPath.split('/');
          console.log(router);
        }
      }
      
      console.log(message);
    });
  }
  componentWillMount() {
    fs.readFile(path.join(app.getAppPath(), "build/file.txt"), 'utf-8', function(err, buf) {
      if (err) throw err;
      console.log(buf.toString());
    });
    //const notifierWindowsBalloon = new WindowsBalloon({
    //  withFallback: false, // Try Windows Toast and Growl first?
    //  customPath: path.join(app.getAppPath(), 'build/vendor/notifu/notifu.exe') // Relative/Absolute path if you want to use your fork of notifu
    //});
    const notifierWindowsBalloon = new WindowsBalloon();
    notifierWindowsBalloon.notify({
      title: "Harmony",
      message: "Testing Notification",
      sound: false, // true | false.
      time: 10000, // How long to show balloon in ms
      wait: false, // Wait for User Action against Notification
      type: 'info' // The notification type : info | warn | error
    }, function(error, response) {
      console.log(response);
    });
  }
  componentDidMount() {
    // console.log(assetsLocation);
    this.init();
    /*
    dialog.showMessageBox(null, { type: 'info', title: 'Wow', message: 'MessageBox testing...', buttons: ['Ok', 'Retry', 'Cancel'] }, (ev) => {
      console.log(ev);
      if (ev === 1) dialog.showErrorBox('Error!', 'Testing error box');
    });
    // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    */
    //let Notifier = new WindowsToaster({
    //  withFallback: false,
    //  customPath: path.join(app.getAppPath(), 'build/vendor/snoreToast/SnoreToast.exe')
    //});

    Notifier.notify({
      title: 'Harmony',
      message: 'Hello. This is a longer text\nWith "some" newlines.',
      wait: false,
      icon: assetsLocation + "/img/coulson.jpg", //path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked'), 'assets/img/coulson.jpg'),
      sound: true
    }, function(err, data) {
      // Will also wait until notification is closed.
      console.log('Waited');
      console.log(err, data);
    });

    Notifier.on('timeout', function() {
      console.log('notifier Timed out!');
    });

    Notifier.on('click', function() {
      console.log('notifier Clicked!');
    });
  }

  openLink(event) {
    let link = event.target.getAttribute('href');
    if (link) {
      openExternal(link, {}, (err) => {
        if (err) {
          throw err;
        }
        shell.beep();
        console.log("visit: ", link);
      })
      event.preventDefault();
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
            <img src={ImageNotif} alt="test" />
          </p>
          <a className="App-link" href="harmony://anu">Anu</a>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            onClick={this.openLink}
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
