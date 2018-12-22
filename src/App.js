import React, { Component } from 'react';
import Electron from 'electron';
import Notifier from 'node-notifier';
import path from 'path';
import fs from 'fs';
import logo from './logo.svg';
import './App.css';

// const { dialog } = Electron.remote;
const { BrowserWindow, ipcMain, ipcRenderer, Notification, remote } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
const { app } = remote;

const WindowsBalloon = require('node-notifier').WindowsBalloon;
const WindowsToaster = require('node-notifier').WindowsToaster;

const Platform = "windows";

class App extends Component {
  constructor(props) {
    super(props);
  }
  init() {
    ipcRenderer.on("harmony-url", (event, message) => {
      console.log(message);
    });
  }
  componentWillMount() {
    this.init();
    fs.readFile(path.join(app.getAppPath(), "build/file.txt"), 'utf-8', function(err, buf) {
      if (err) throw err;
      console.log(buf.toString());
    });
    const notifierWindowsBalloon = new WindowsBalloon({
      withFallback: false, // Try Windows Toast and Growl first?
      customPath: path.join(app.getAppPath(), 'build/vendor/notifu/notifu.exe') // Relative/Absolute path if you want to use your fork of notifu
    });
    
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
    this.init();
    /*
    dialog.showMessageBox(null, { type: 'info', title: 'Wow', message: 'MessageBox testing...', buttons: ['Ok', 'Retry', 'Cancel'] }, (ev) => {
      console.log(ev);
      if (ev === 1) dialog.showErrorBox('Error!', 'Testing error box');
    });
    // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    */
    let notifier = new WindowsToaster({
      withFallback: false,
      customPath: path.join(app.getAppPath(), 'build/vendor/snoreToast/SnoreToast.exe')
    });

    notifier.notify({
      title: 'Harmony',
      message: 'Hello. This is a longer text\nWith "some" newlines.',
      wait: false,
      icon: 'file://' + path.join(app.getAppPath(), 'build/coulson.jpg'),
      sound: true
    }, function(err, data) {
      // Will also wait until notification is closed.
      console.log('Waited');
      console.log(err, data);
    });

    notifier.on('timeout', function() {
      console.log('notifier Timed out!');
    });

    notifier.on('click', function() {
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
          </p>
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
