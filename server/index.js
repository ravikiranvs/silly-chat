process.env.NODE_ENV = 'production';

const socket = require('socket.io');

require('babel-register');

require('./app')(socket);