var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require("compression-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, '../public/assets');
// var APP_DIR = path.resolve(__dirname, '../app');
var CLIENT_DIR = path.resolve(__dirname, '../client');

// webpack options
module.exports = {
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('app.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      mangle: {
        except: []
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};