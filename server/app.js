var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var botReply = require('./bot');


app.use(express.static('public'));

var users = {};

io.on('connection', function (socket) {
  users[socket.id.replace('/#', '')] = 'Unknown';

  io.emit('users', users);

  socket.on('disconnect', function () {
    users[socket.id.replace('/#', '')] = undefined;
    io.emit('users', users);
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    var chatMsg = JSON.parse(msg);
    botReply(chatMsg.user, chatMsg.message, function (reply) {
      var botMsg = {
        user: 'Bot',
        message: reply,
        time: chatMsg.time
      }
      io.emit('chat message', JSON.stringify(botMsg));
    });
  });

  socket.on('chat isTyping', function (typing) {
    io.emit('chat isTyping', typing);
  });

  socket.on('users', function (name) {
    users[socket.id.replace('/#', '')] = name;
    io.emit('users', users);
  });
});

var port = process.env.PORT || 5000;

http.listen(port, function () {
  console.log('listening on *:5000');
});