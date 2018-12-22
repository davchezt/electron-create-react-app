import React, { Component } from 'react';
import Electron from 'electron';
import Notifier from 'node-notifier';
import path from 'path';

import ImageNotif from './coulson.jpg';
import logo from './logo.svg';
import './App.css';

const { ipcRenderer, remote } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
const { app } = remote;

const { WindowsBalloon } = Notifier;
const notifierWindowsBalloon = new WindowsBalloon();

const assetsLocation = process.env.NODE_ENV == "development" ?
  path.resolve(path.join(__dirname, "../build/assets")) :
  path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked/assets'));

class App extends Component {
  constructor(props) {
    super(props);
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
    
    notifierWindowsBalloon.notify({
      title: "Harmony",
      message: "Testing Notification",
      sound: false,
      time: 5000,
      wait: false,
      type: 'info'
    }, function(error, response) {
      console.log(response);
    });
  }
  componentDidMount() {
    this.init();
    
    Notifier.notify({
      title: 'Harmony',
      message: 'Hello. This is a longer text\nWith "some" newlines.',
      wait: false,
      icon: assetsLocation + "/img/coulson.jpg",
      sound: true
    }, function(err, data) {
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
          <a className="App-link" href="harmony://test">test deep-link</a>
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
