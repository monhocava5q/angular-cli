import {webpackOutputOptions, webpackDevConfig, webpackProdConfig} from '../models/';

// Configure build and output;
const Task            = require('ember-cli/lib/models/task');
const webpack         = require('webpack');

let lastHash = null;

module.exports = Task.extend({
  // Options: String outputPath
  run: () => {
    let commandOptions = this.options;

    const webpackCompiler = webpack(webpackProdConfig);
    const ProgressPlugin  = require('webpack/lib/ProgressPlugin');

    webpackCompiler.apply(new ProgressPlugin({
      profile: true
    }));

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
