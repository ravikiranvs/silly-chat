var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

var users = {};

io.on('connection', function(socket){
  users[socket.id] = 'Unknown';
  
  io.emit('users', users);
  
  socket.on('disconnect', function(){
    users[socket.id] = undefined;
    io.emit('users', users);
  });
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  socket.on('chat isTyping', function(typing){
    io.emit('chat isTyping', typing);
  });
  
  socket.on('users', function(name){
    users[socket.id] = name;
    io.emit('users', users);
  });
});

var port = process.env.PORT || 5000;

http.listen(port, function(){
  console.log('listening on *:5000');
});