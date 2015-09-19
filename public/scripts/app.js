var socket = io();

function sendMessage(e){
	var txtMessage = document.getElementById('m');
	var msg = {user: userName, message: txtMessage.value};
	socket.emit('chat message', JSON.stringify(msg));
	txtMessage.value = '';
	return false;
};

socket.on('chat message', function(msg){
	msg = JSON.parse(msg);
	
	var ul = document.getElementById("messages");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(msg.message));
	if(msg.user == userName)
		li.setAttribute("class", "bubble me");
	else
		li.setAttribute("class", "bubble you");
	ul.appendChild(li);
	
	if(document.hidden){
		document.title = "You have unread messages";
		var notification = new Notification(msg.user,{
			body: msg.message,
			icon: 'images/silly_chat_128.png'
		});
		notification.onclick = function() { window.focus(); };
		setTimeout(function(){
		notification.close();
		},4000);
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