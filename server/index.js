console.log('starting app!');

process.env.NODE_ENV = 'production';

require('babel-register')({
  presets: [ 'es2015' ]
});

require('./app');