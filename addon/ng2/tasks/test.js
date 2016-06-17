/* jshint node: true */
'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var Task = require('ember-cli/lib/models/task');
var path = require('path');
var ngAppResolve = require('../models').ngAppResolve;
var webpackTestConfig = require('../models').webpackTestConfig;

console.log("WEBPACK TEST CONFIG PLEASE VERIFY", webpackTestConfig);

// require dependencies within the target project
function requireDependency(root, moduleName) {
  var packageJson = require(path.join(root, 'node_modules', moduleName, 'package.json'));
  var main = path.normalize(packageJson.main);
  return require(path.join(root, 'node_modules', moduleName, main));
}

module.exports = Task.extend({

  run: function (options) {
    var projectRoot = this.project.root;
    return new Promise((resolve) => {
      var webpack = require('webpack');
      var karma = requireDependency(projectRoot, 'karma');
      var karmaConfig = path.join(projectRoot, this.project.ngConfig.test.karma.config);

      options.plugins = [
        require("karma-jasmine"),
        require("karma-chrome-launcher"),
        require("karma-webpack"),
        require("karma-coverage"),
        require("karma-mocha-reporter"),
        require("karma-sourcemap-loader"),
        require("karma-phantomjs-launcher")
      ];

      options.files = [{ pattern: './config/spec-bundle.js', watched: false }];
      options.preprocessors = { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] };
      options.webpack = webpackTestConfig;
      options.webpackServer = { noInfo: true};

      // Convert browsers from a string to an array
      if (options.browsers) {
        options.browsers = options.browsers.split(',');
      }

      console.log(options);
      options.configFile = karmaConfig;
      var karmaServer = new karma.Server(options, resolve);

      karmaServer.start();
    });
  }
});
