const Command = require('ember-cli/lib/models/command');
const win = require('ember-cli/lib/utilities/windows-admin');

// const Build = require('../tasks/build');
// const BuildWatch = require('../tasks/build-watch');

// Webpack Configuration
const webpack = require('webpack');
const webpackConfig = require('../tasks/webpack-build-config');
const webpackCompiler = webpack(webpackConfig);
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const webpackOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
}

let lastHash = null;

webpackCompiler.apply(new ProgressPlugin({
  profile: true
}));


module.exports = Command.extend({
  name: 'build',
  description: 'Builds your app and places it into the output path (dist/ by default).',
  aliases: ['b'],

  availableOptions: [
    { name: 'environment',    type: String,  default: 'development', aliases: ['e', { 'dev': 'development' }, { 'prod': 'production' }] },
    { name: 'output-path',    type: 'Path',  default: 'dist/',       aliases: ['o'] },
    { name: 'watch',          type: Boolean, default: false,         aliases: ['w'] },
    { name: 'watcher',        type: String },
    { name: 'suppress-sizes', type: Boolean, default: false }
  ],

  run: function(commandOptions) {
    return new Promise((resolve, reject) => {
      webpackCompiler.run((err, stats) => {
        // Don't keep cache
        // TODO: Make conditional if using --watch
        webpackCompiler.purgeInputFileSystem();

        if(err) {
          lastHash = null;
          console.error(err.stack || err);
          if(err.details) console.error(err.details);
            reject(err.details);
        }

        if(stats.hash !== lastHash) {
          lastHash = stats.hash;
          process.stdout.write(stats.toString(webpackOutputOptions) + "\n");
        }
        resolve();
      });
    });
  },

  taskFor: function(options) {
    if (options.watch) {
      return BuildWatch;
    } else {
      return Build;
    }
  }
});

module.exports.overrideCore = true;
