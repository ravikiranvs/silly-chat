function sendMessage(e){
	var txtMessage = document.getElementById('m');
	var dNow = new Date();
	var msg = {
		user: userName, 
		message: emojione.toImage(txtMessage.value), 
		time: dNow.getHours() + ":" + dNow.getMinutes()
	};
	if(msg.message != "")
		socket.emit('chat message', JSON.stringify(msg));
	txtMessage.value = '';
	return false;
};

socket.on('chat message', function(msg){
	msg = JSON.parse(msg);
	
	var ul = document.getElementById("messages");
	var li = document.createElement("li");
	var span = document.createElement("span");
	//li.appendChild(document.createTextNode(msg.message));
	li.innerHTML = msg.message;
	if(msg.user == userName)
		li.setAttribute("class", "bubble me");
	else
		li.setAttribute("class", "bubble you");
	span.innerText = msg.time;
	span.setAttribute("class", "time-stamp");
	li.appendChild(span);
	ul.appendChild(li);
	
	if(document.hidden || isPageNotInFocus){
		document.title = "You have unread messages";
		
		if(config.notification == "true"){
			var notification = new Notification(msg.user,{
				body: msg.message,
				icon: 'images/silly_chat_128.png'
			});
			notification.onclick = function() { window.focus(); };
			setTimeout(function(){
			notification.close();
			},4000);
		}
	}
});

var visProp = getHiddenProp();
	if (visProp) {
	var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
	document.addEventListener(evtname, visChange);
}

function visChange() {
	document.title = "silly-chat";
}
	
function getHiddenProp(){
	var prefixes = ['webkit','moz','ms','o'];
	
	// if 'hidden' is natively supported just return it
	if ('hidden' in document) return 'hidden';
	
	// otherwise loop over all the known prefixes until we find one
	for (var i = 0; i < prefixes.length; i++){
		if ((prefixes[i] + 'Hidden') in document) 
			return prefixes[i] + 'Hidden';
	}

	// otherwise it's not supported
	return null;
}

var canShowNotifications = false;
	Notification.requestPermission(function(permission){
	canShowNotifications = (permission === 'granted');
});

function emojiReplace(txtM){
	msgTyping();
	if(txtM.value.indexOf(':') >= 0)
		txtM.value = txtM.value.replace(':)', ':blush:')
			.replace(':(', ':disappointed:')
			.replace(':P', ':stuck_out_tongue_winking_eye:')
			.replace(':D', ':smile:')
			.replace(':*', ':kissing_heart:');
}

socket.on('users', function(users){
	if(users[socket.id] != config.name){
		setUserName(config.name);
	}
	else{
		var ul = document.getElementById("users");
		
		while( ul.firstChild ){
			ul.removeChild( ul.firstChild );
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

var isPageNotInFocus = false;
window.onfocus = function(){
	isPageNotInFocus = false;
}
window.onblur = function(){
	isPageNotInFocus = true;
}


function toggleSideMenu(){
	var sideMenu = DomElements.Settings.div;
	if(sideMenu.className ==  "showSideNav")
		sideMenu.className =  "";
	else{
		sideMenu.className =  "showSideNav";
		DomElements.Settings.name.value = config.name;
		DomElements.Settings.notification.checked = (config.notification == "true");
	}
}

function saveSettings(){
	config.name = DomElements.Settings.name.value;
	config.notification = "" + DomElements.Settings.notification.checked;
	
	setUserName(config.name);
	
	toggleSideMenu();
}

function newSmallWindow()
{
	window.open(window.location.href, "_blank", "width=400, height=" + (window.screen.availHeight - 65));
	
	// ==UserScript==
	// @grant       GM_addStyle
	// ==/UserScript==
	setTimeout(function(){
		var ww = window.open('', '_self', ''); 
		ww.close(); 
	}, 1000);
}

function msgTyping(){
	socket.emit('chat isTyping', socket.id);
}

socket.on('chat isTyping', function(id){
	var activeLi = document.getElementById(id);
	activeLi.className = "typing";
	setTimeout(function(){
		var lis = document.getElementById("users").children;
		for(var i = 0; i < lis.length; i++){
			lis[i].className = "";
		}
	}, 2000)
});

// scroll weather control horizontally.
function scrollHorizontally(e) {
    var weatherDiv;
    if (e.target.className == 'weather-scroller') weatherDiv = e.target;
    if (e.target.parentNode.className == 'weather-scroller') weatherDiv = e.target.parentNode;
    if (weatherDiv) {
     var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
     weatherDiv.scrollLeft -= (delta * 40); // Multiplied by 40
     e.preventDefault();
    }
}
if (window.addEventListener) {
    // IE9, Chrome, Safari, Opera
    window.addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    window.addEventListener("DOMMouseScroll", scrollHorizontally, false);
} else {
    // IE 6/7/8
    window.attachEvent("onmousewheel", scrollHorizontally);
}