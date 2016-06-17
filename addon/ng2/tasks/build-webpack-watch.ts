import {webpackOutputOptions, webpackDevConfig, webpackProdConfig} from '../models/';

import {IServeTaskOptions} from '../commands/serve';

const Task            = require('ember-cli/lib/models/task');
const webpack         = require('webpack');

let lastHash = null;

module.exports = Task.extend({
  run: () => {
    let commandOptions: IServeTaskOptions = this.options;

    const webpackCompiler = webpack(webpackDevConfig);
    const ProgressPlugin  = require('webpack/lib/ProgressPlugin');

    webpackCompiler.apply(new ProgressPlugin({
      profile: true
    }));

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
