/* @flow weak */

'use strict';

var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

module.exports = function(webpackConfig) {
  return function(callback) {
    new WebpackDevServer(webpack(webpackConfig), {
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      quiet: false,
      noInfo: true,
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    }).listen(8888, '0.0.0.0', function(err) {
      if (err)
        throw new gutil.PluginError('webpack-dev-server', err);

      gutil.log('[webpack-dev-server]', 'localhost:8888/build/client.js');
      callback();
    });
  };
};
