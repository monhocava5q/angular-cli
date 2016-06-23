import * as Promise from 'ember-cli/lib/ext/promise';
import * as Task from 'ember-cli/lib/models/task';
import * as chalk from 'chalk';
import * as webpack from 'webpack';
import * as webpackToolkit from '@angularclass/webpack-toolkit';

const ProgressPlugin  = require('webpack/lib/ProgressPlugin');
const config = webpackToolkit.webpackConfig;

let lastHash: any = null;
module.exports = Task.extend({
  run: (runTaskOptions: ServeTaskOptions) => {
    let ui = this.ui;
    let config = webpackDllConfi

    const webpackCompiler = webpack(config);

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
