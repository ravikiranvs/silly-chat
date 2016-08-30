console.log('starting app!');

process.env.NODE_ENV = 'production';

const socket = require('socket.io');

require('babel-register')({
  presets: [ 'es2015' ]
});

require('./app')(socket);