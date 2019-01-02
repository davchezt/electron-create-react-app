import React, { Component } from 'react';
import Electron from 'electron';
import Notifier from 'electron-node-notifier';
import path from 'path';
import { NavLink, Route, Link, HashRouter, Switch } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

const { ipcRenderer, remote } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
const { app } = remote;

const { WindowsBalloon } = Notifier;
const notifierWindowsBalloon = new WindowsBalloon();

const assetsLocation = process.env.NODE_ENV === "development" ?
  path.resolve(path.join(__dirname, "../public/assets")) :
  path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked/assets'));

const About = () => (
  <div>
    <h2>About</h2>
    <Link to="/">Home</Link>
  </div>
);
const Users = () => (
  <div>
    <h2>Users</h2>
    <Link to="/">Home</Link>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inDevelopment: true
    }
  }

  init() {
    ipcRenderer.on("harmony-url", (event, message) => {
      if (message.length !== 0) {
        if (message[0].length > 1) {
          let urlPath = message[0].split(":/")[1];
          urlPath = urlPath.toString().substring(0, urlPath.length - 1);
          console.log(urlPath);
          window.location.hash = urlPath;
        }
        console.log(event)
      }
      console.log(message);
    });
  }

  componentWillMount() {
    if (process.env.NODE_ENV !== "development") {
      this.setState({ inDevelopment: false });
    }
    /*
    notifierWindowsBalloon.notify({
      title: "Harmony",
      message: "Testing Notification",
      sound: false,
      time: 10000,
      wait: false,
      type: 'info'
    }, function (error, response) {
      if (response) console.log(response);
      if (error) console.log(error);
    });

    notifierWindowsBalloon.on('timeout', function () {
      console.log('notifier Timed out!');
    });

    notifierWindowsBalloon.on('click', function () {
      console.log('notifier Clicked!');
    });
    */
  }
  componentDidMount() {
    this.init();
    /*
    Notifier.notify({
      title: 'Harmony',
      message: 'Hello. This is a longer text\nWith "some" newlines.',
      time: 10000,
      wait: false,
      icon: assetsLocation + "/img/coulson.jpg",
      sound: true
    }, function (err, data) {
      if (err) console.log(err);
      if (data) console.log(err);
    });

    Notifier.on('timeout', function () {
      console.log('notifier Timed out!');
    });

    Notifier.on('click', function () {
      console.log('notifier Clicked!');
    });
    */
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
      <div style={styles}>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={() => (
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <p>
                    Edit <code>src/App.js</code> and save to reload.<br />
                    <NavLink exact to="/users" activeClassName="selected">Users</NavLink>
                  </p>
                  {!this.state.inDevelopment && <a className="App-link" href="harmony://about">test deep-link</a>}
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
            )} />
            <Route path="/about" component={About} />
            <Route path="/users" component={Users} />
            <Route path="/dua" component={() => (
              <div>
                <h2>DUA</h2>
                <Link to="/">Home</Link>
              </div>
            )} />
            <Route component={() => (
              <div>
                <h1>404</h1>
                <Link to="/">Home</Link>
              </div>
            )} />
          </Switch>
        </HashRouter>
      </div>
      /**/
    );
  }
}

export default App;

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};