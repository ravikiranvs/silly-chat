var DomElements = {
  UserNameBox: {
    div: document.getElementById('name'),
    input: document.getElementById('txtName')
  },
  Messages: {
    ul: document.getElementById('messages')
  },
  MsgBox: {
    form: document.getElementById('sendM'),
    input: document.getElementById('m')
  },
  Header: {
    div: document.getElementById('header'),
    ul: document.getElementById('users')
  },
  Settings: {
    div: document.getElementById('settings'),
    name: document.getElementById('settingsName'),
    notification: document.getElementById('settingsNotification'),
    button: document.getElementById('settingsSave')
  }
}

module.exports = DomElements;