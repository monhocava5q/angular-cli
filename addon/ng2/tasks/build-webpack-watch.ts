import {webpackCommonConfig, webpackOutputOptions} from '../models/webpack-build-config.ts';

const Task            = require('ember-cli/lib/models/task');
const webpack         = require('webpack');
const webpackCompiler = webpack(webpackCommonConfig);
const ProgressPlugin  = require('webpack/lib/ProgressPlugin');

webpackCompiler.apply(new ProgressPlugin({
  profile: true
}));

let lastHash = null;

module.exports = Task.extend({
  run: () => {
    let commandOptions = this.options;

    return new Promise( (resolve, reject) => {
      webpackCompiler.watch({}, (err, stats) => {
        if (err) {
          lastHash = null;
          console.error(err.stack || err);
          if(err.details) console.error(err.details);
            reject(err.details);
        }

        if(stats.hash !== lastHash) {
          lastHash = stats.hash;
          process.stdout.write(stats.toString(webpackOutputOptions) + "\n");
        }
      })
    })
  }
});
