import test from 'ava';
import jQuery from 'jquery';
import jsDom from 'jsdom';

require('babel-register')({
  presets: [ 'es2015' ]
});

var server = require('./app').default;

var io = require('socket.io-client');

var socketURL = 'http://localhost:5000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

var localDocument = jsDom.jsdom('<html></html>');
var localWindow = localDocument.defaultView;
var $ = jQuery(localWindow);

test.cb('Can establist a web socket connection.', t => {
    var client1 = io.connect(socketURL);
    client1.on('connect', function (data) {
        client1.disconnect();
        t.end();
    });
});

test.cb('Can send and receive messages.', t => {
    var client1 = io.connect(socketURL);
    client1.on('connect', function (data) {
        var client2 = io.connect(socketURL);
        client2.on('connect', function (data) {
            var isMessageReceived = false;
            client2.on('chat message', function (strMsg) {
                var msg = JSON.parse(strMsg);
                if (msg.message == 'hello world') {
                    isMessageReceived = true;
                }
            });
            client1.emit('chat message', JSON.stringify({ userId: client1.id, time: Date.now(), username: 'client1', message: 'hello world' }));
            setTimeout(function () {
                t.true(isMessageReceived);
                client1.disconnect();
                client2.disconnect();
                t.end();
            }, 100);
        });
    });
});


test.cb('Bot is running.', t => {
    var client1 = io.connect(socketURL);
    client1.on('connect', function (data) {
        var botGreetingReceived = false;
        client1.on('chat message', function (strMsg) {
            var msg = JSON.parse(strMsg);
            if (msg.username == 'Bot') {
                var msgFromBot = $($.parseHTML(msg.message));
                if (msgFromBot.text().indexOf('unknown,  How may I assist you!') > 0) {
                    client1.disconnect();
                    t.end();
                }
            }
        });
        client1.emit('chat message', JSON.stringify({ userId: client1.id, time: Date.now(), username: 'client1', message: 'bot' }));
    });
});

test.after('cleanup', t => {
    server.closeServer();
});