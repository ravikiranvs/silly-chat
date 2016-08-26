class Configuration {
  constructor(socket) {
    const configStrs = (document.cookie && document.cookie.indexOf('SillyChatConfig=') > 0) ? document.cookie.split('SillyChatConfig=')[1].split('##') : ['', 'true'];
    this._name = configStrs[0];
    this._displayNotification = configStrs[1] == 'true';
    this._socket = socket;
  }

  static getInstance(socket) {
    if (this._instance)
      return this._instance;
    else
      return new Configuration(socket);
  }

  getName() {
    return this._name;
  }

  getDisplayNotification() {
    return this._displayNotification;
  }

  setName(name) {
    document.cookie = `SillyChatConfig=${name}###${this._displayNotification}`;
    this._socket.emit('users', name);
  }

  setDisplayNotification(displayNotification) {
    document.cookie = `SillyChatConfig=${this._name}###${displayNotification}`;
  }
}

export default Configuration;