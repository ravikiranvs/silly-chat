import express from 'express';
import http from 'http';
const socket = require('socket.io');
import SillyChatBot from './bot';
import gzipStatic from 'connect-gzip-static';

const app = express();
const httpServer = http.Server(app);
const io = socket(httpServer);
const chatBot = new SillyChatBot();

app.use(gzipStatic('public'));
//app.use(express.static('public'));

let users = {};

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
    chatBot.botReply(users[chatMsg.user], chatMsg.message, function (reply) {
      var botMsg = {
        user: 'Bot',
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
  console.log('listening on *:5000');
});