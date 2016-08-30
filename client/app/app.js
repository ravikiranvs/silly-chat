import './app.css';
import Chat from '../chat/chat';
import Configuration from '../configuration/index';
import Login from '../login/login';
import React from 'react';
import Socket from 'socket.io-client';
import WindowVisibilityBroadcaster from '../window-focus';

class App extends React.Component {
  constructor() {
    super();
    this.socket = Socket();
    this.config = Configuration.getInstance(this.socket);
    this.windowVisibilityBroadcaster = new WindowVisibilityBroadcaster.Instance();

    this.state = { name: this.config.getName() };
    this.onLogin = this.onLogin.bind(this);
  }

  getChildContext() {
    return {
      socket: this.socket,
      config: this.config,
      windowVisibilityBroadcaster: this.windowVisibilityBroadcaster
    };
  }

  onLogin() {
    this.setState({ name: this.config.getName() });
  }

  render() {
    let controlToRender = null;
    if (this.state.name != '') {
      controlToRender = <Chat />;
    } else {
      controlToRender = <Login login={this.onLogin} />;
    }
    return (
      <div className="app-main">
        {controlToRender}
      </div>
    );
  }
}

App.childContextTypes = {
  socket: React.PropTypes.object,
  config: React.PropTypes.object,
  windowVisibilityBroadcaster: React.PropTypes.object
};

export default App;