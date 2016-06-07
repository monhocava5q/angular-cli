const Task     = require('ember-cli/lib/models/task');

// Webpack Configuration
const webpack = require('webpack');
const webpackConfig = require('../models/webpack-build-config');
const webpackCompiler = webpack(webpackConfig);
const webpackOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
}

const ProgressPlugin = require('webpack/lib/ProgressPlugin');
webpackCompiler.apply(new ProgressPlugin({
  profile: true
}));


let lastHash = null;

module.exports = Task.extend({
  // Options: String outputPath
  run: function() {
    let commandOptions = this.options;

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
  }
});
