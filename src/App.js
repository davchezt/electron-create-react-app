import React, { Component } from 'react';
import Electron from 'electron';
import Store from 'electron-store';

// import Notifier from 'electron-node-notifier';
// import path from 'path';
import { NavLink, Route, Link, HashRouter, Switch } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

// Helper
import Logger from './Logger';
import Api from './Api';
import RaectLink from './components/Link';

import About from './screen/About';
import Dua from './screen/Dua';

const store = new Store();
const { ipcRenderer, /*remote*/ } = Electron;
const { shell } = Electron;
const { openExternal } = shell;
//const { app } = remote;

//const { WindowsBalloon } = Notifier;
//const notifierWindowsBalloon = new WindowsBalloon();

//const assetsLocation = process.env.NODE_ENV === "development" ? path.resolve(path.join(__dirname, "../public/assets")) : path.join(app.getAppPath().replace('app.asar', 'app.asar.unpacked/assets'));

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
      inDevelopment: true,
      clientToken: null,
      clientCredential: null
    }
    this.openLink = this.openLink.bind(this);
  }

  init() {
    Api.get('http://localhost:8080/products', (data) => {
      Logger.json(data)
    })
    
    ipcRenderer.on("harmony-url", (event, message) => {
      if (message.length !== 0) {
        if (message[0].length > 1) {
          let urlPath = message[0].split(":/")[1];
          urlPath = urlPath.toString().substring(0, urlPath.length - 1);
          // console.log(urlPath);
          window.location.hash = urlPath;
          if (typeof(window.history.pushState) == 'function') {
            window.history.pushState(null, '', '#' + urlPath);
            console.log('history')
          } else {
            window.location.hash = urlPath;
            console.log('hash')
          }
          window.history.go(window.history.length);
          window.location.replace(window.location.hash.replace(urlPath, urlPath));
        }
        // console.log(event)
      }
      // console.log(message);
      // ipcRenderer.removeAllListeners();
    });
  }

  componentWillMount() {
    if (store.get('credential') === undefined) {
      store.set('credential.email', 'davchezt@gmail.com');
      store.set('credential.password', '4Bahagia4');
    }
    else {
      this.setState({ clientCredential: store.get('credential') }, () => {
        Logger.log('credential updated to: ' + JSON.stringify(this.state.clientCredential));
        if (store.get('clientToken') === undefined) {
          Api.auth('http://localhost:8080/user/login', this.state.clientCredential, (data) => {
            let object = JSON.parse(data);
            if (object.token) {
              store.set('clientToken', object.token);
            }
          }, true)        
        }
      });
    }

    if (store.get('clientToken')) {
      this.setState({ clientToken: store.get('clientToken') }, () => {
        Logger.log('token updated to: ' + this.state.clientToken);
        Api.patch('http://localhost:8080/products/5c2d33667d5b1e0d648d6747', this.state.clientToken, { name: "Foto Saya I", price: "123456789" }, (data) => {
          Logger.json(data);
        });
      });
    }

    if (process.env.NODE_ENV !== "development") {
      this.setState({ inDevelopment: false });
    }
    
    /*
    Api.put('http://localhost/test.php', this.state.clientToken, { "name": "Foto Saya I", "price": "4000" }, (data) => {
      Logger.info(JSON.parse(data))
    }, true)

    Api.patch('http://localhost:8080/products/5c2d33667d5b1e0d648d6747', this.state.clientToken, { "name": "Foto Saya I", "price": "4000" }, (data) => {
      Logger.json(data);
    });

    Api.del('http://localhost:8080/products/5c2d33667d5b1e0d648d6747', this.state.clientToken, { "name": "Foto Saya I", "price": "4000" }, (data) => {
      Logger.info(data)
    }, true)
    */
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
        Logger.log("visit: " + link);
        Logger.info(this.state.clientToken);
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
                    <NavLink exact to="/about" activeClassName="selected">About</NavLink>
                    <br />
                    <NavLink exact to="/dua" activeClassName="selected">Dua</NavLink>
                  </p>
                  {!this.state.inDevelopment && <a className="App-link" href="harmony://about">test deep-link</a>}
                  <RaectLink
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.openLink}
                  >
                    Learn React
                  </RaectLink>
                </header>
              </div>
            )} />
            <Route path="/about" component={About} />
            <Route path="/users" component={Users} />
            <Route path="/dua" component={Dua} />
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