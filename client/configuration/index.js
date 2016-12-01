class Configuration {
    constructor(socket) {
        const configStrs = (document.cookie && document.cookie.indexOf('SillyChatConfig=') >= 0) ? document.cookie.split('SillyChatConfig=')[1].split('###') : ['', 'true'];
        this._name = configStrs[0];
        this._displayNotification = configStrs[1] == 'true';
        this._socket = socket;
    }

    resetState() {
        const configStrs = (document.cookie && document.cookie.indexOf('SillyChatConfig=') >= 0) ? document.cookie.split('SillyChatConfig=')[1].split('###') : ['', 'true'];
        this._name = configStrs[0];
        this._displayNotification = configStrs[1] == 'true';
    }

    static getInstance(socket) {
        if (this._instance)
            return this._instance;
        else
            return new Configuration(socket);
    }

    getName() {
        this.resetState();
        return this._name;
    }

    getDisplayNotification() {
        this.resetState();
        return this._displayNotification;
    }

    setName(name) {
        this._name = name;
        document.cookie = `SillyChatConfig=${name}###${this._displayNotification}`;
        this._socket.emit('users', name);
    }

    setDisplayNotification(displayNotification) {
        this._displayNotification = displayNotification;
        document.cookie = `SillyChatConfig=${this._name}###${displayNotification}`;
    }
}

export default Configuration;