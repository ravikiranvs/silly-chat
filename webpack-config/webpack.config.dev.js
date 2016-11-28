var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var BUILD_DIR = path.resolve(__dirname, '../public/assets');
// var APP_DIR = path.resolve(__dirname, '../app');
var CLIENT_DIR = path.resolve(__dirname, '../client');

// webpack options
module.exports = {
  devtool: "inline-source-map",
  entry: {
    // bundle: APP_DIR + '/index.js',
    app: CLIENT_DIR + '/index.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js?$/, include : CLIENT_DIR, loader: 'babel'},
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.ttf$/, loader: 'file' }
    ],
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new LiveReloadPlugin({})
  ]
};