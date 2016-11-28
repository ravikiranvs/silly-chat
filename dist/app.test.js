'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register')({
    presets: ['es2015']
});

var server = require('./app').default;

var io = require('socket.io-client');

var socketURL = 'http://localhost:5000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

var localDocument = _jsdom2.default.jsdom('<html></html>');
var localWindow = localDocument.defaultView;
var $ = (0, _jquery2.default)(localWindow);

_ava2.default.cb('Can establist a web socket connection.', function (t) {
    var client1 = io.connect(socketURL);
    client1.on('connect', function (data) {
        client1.disconnect();
        t.end();
    });
});

_ava2.default.cb('Can send and receive messages.', function (t) {
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

_ava2.default.cb('Bot is running.', function (t) {
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

_ava2.default.after('cleanup', function (t) {
    server.closeServer();
});