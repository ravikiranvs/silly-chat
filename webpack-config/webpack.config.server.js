var path = require('path');

var SERVER_DIR = path.resolve(__dirname, '../server');
var DEST_DIR = path.resolve(__dirname, '../dist');

// webpack options
module.exports = {
  entry: {
    app: SERVER_DIR + '/app.js'
  },
  output: {
    path: DEST_DIR,
    filename: 'server.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js?$/, include : SERVER_DIR, loader: 'babel'},
      { test: /\.json?$/, loader: 'file'}
    ],
  }
};