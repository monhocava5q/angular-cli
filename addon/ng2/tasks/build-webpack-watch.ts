import {webpackOutputOptions, webpackDevConfig, webpackProdConfig, webpackDevMaterialConfig} from '../models/';

import {ServeTaskOptions} from '../commands/serve';

const Task            = require('ember-cli/lib/models/task');
const webpack         = require('webpack');
const ProgressPlugin  = require('webpack/lib/ProgressPlugin');

let lastHash: any = null;

module.exports = Task.extend({
  run: (runTaskOptions: ServeTaskOptions) => {
    let config;

    //TODO# Remove after testing material
    if (runTaskOptions.environment === 'material') {
      config = webpackDevMaterialConfig;
    } else {
      config = webpackDevConfig;
    }

    const webpackCompiler = webpack(config);

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
