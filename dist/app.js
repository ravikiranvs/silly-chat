'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _connectGzipStatic = require('connect-gzip-static');

var _connectGzipStatic2 = _interopRequireDefault(_connectGzipStatic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var httpServer = _http2.default.Server(app);
var io = (0, _socket2.default)(httpServer);
var chatBot = new _bot2.default();

app.use((0, _connectGzipStatic2.default)('public'));
//app.use(express.static('public'));

var users = {};

io.on('connection', function (socket) {
    users[socket.id.replace('/#', '')] = 'Unknown';

    io.emit('users', users);

    socket.on('disconnect', function () {
        users[socket.id.replace('/#', '')] = undefined;
        io.emit('users', users);
    });

    // incoming chat message
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        var chatMsg = JSON.parse(msg);
        chatBot.botReply(users[chatMsg.userId], chatMsg.message, function (reply) {
            var botMsg = {
                username: 'Bot',
                message: reply,
                time: chatMsg.time
            };
            io.emit('chat message', JSON.stringify(botMsg));
        });
    });

    // incoming key press
    socket.on('chat isTyping', function (typing) {
        io.emit('chat isTyping', typing);
    });

    // incoming user name change
    socket.on('users', function (name) {
        users[socket.id.replace('/#', '')] = name;
        io.emit('users', users);
    });
});

var port = process.env.PORT || 5000;

httpServer.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log('listening on *:' + port);
});

exports.default = {
    closeServer: function closeServer() {
        httpServer.close();
    }
};