'use strict';

console.log('starting app - 0');

process.env.NODE_ENV = 'production';

require('babel-register')({
  presets: ['es2015']
});

console.log('starting app - 1');

require('./app');