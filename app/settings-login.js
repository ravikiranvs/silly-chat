var DomElements = require('./controls');

var configStrs = document.cookie ? document.cookie.split("##") : ["", "true"];
var config = {
  name: configStrs[0],
  notification: configStrs[1]
};


function setUserName(name) {
  if (name) {
    socket.emit('users', name);
    config.name = name;
    document.cookie = name + "##" + config.notification;
  }
}


function MessagingUnScreenToggle(unDisp) {
  if (unDisp) {
    UnDisplayValue = 'block';
    MessageDisplayValue = 'none';

    DomElements.UserNameBox.input.focus();
  }
  else {
    UnDisplayValue = 'none';
    MessageDisplayValue = 'block';

    DomElements.MsgBox.input.focus();
  }

  DomElements.UserNameBox.div.style.display = UnDisplayValue;
  DomElements.Messages.ul.style.display = MessageDisplayValue;
  DomElements.MsgBox.form.style.display = MessageDisplayValue;
  DomElements.Header.div.style.display = MessageDisplayValue;
}


function txtNameKeyUp(event) {
  if (event.keyCode == 13) {
    userName = DomElements.UserNameBox.input.value;
    setUserName(userName);
    MessagingUnScreenToggle(false);
  }
}
DomElements.UserNameBox.input.onkeyup = txtNameKeyUp;


var userName = config.name;
if (userName) setUserName(userName);
MessagingUnScreenToggle(!userName);


socket.on('users', function (users) {
  if (users[socket.id] != config.name) {
    setUserName(config.name);
  }
  else {
    var ul = document.getElementById("users");

    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    for (var id in users) {
      if (users.hasOwnProperty(id)) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(users[id] || id));
        li.id = id;
        ul.appendChild(li);
      }
    }
  }
});


function toggleSideMenu() {
  var sideMenu = DomElements.Settings.div;
  if (sideMenu.className == "showSideNav")
    sideMenu.className = "";
  else {
    sideMenu.className = "showSideNav";
    DomElements.Settings.name.value = config.name;
    DomElements.Settings.notification.checked = (config.notification == "true");
  }
}
document.getElementById('side-menu-button').onclick = toggleSideMenu;
document.getElementById('settings-close').onclick = toggleSideMenu;




function saveSettings() {
  config.name = DomElements.Settings.name.value;
  config.notification = "" + DomElements.Settings.notification.checked;

  setUserName(config.name);

  toggleSideMenu();
}
DomElements.Settings.button.onclick = saveSettings;

module.exports = config;