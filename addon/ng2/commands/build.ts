const Command = require('ember-cli/lib/models/command');
const win = require('ember-cli/lib/utilities/windows-admin');
const path = require('path');

const Build = require('../tasks/build');
const BuildWatch = require('../tasks/build-watch');


const webpack = require('webpack');


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
    // var BuildTask = this.taskFor(commandOptions);
    // var buildTask = new BuildTask({
    //   ui: this.ui,
    //   analytics: this.analytics,
    //   project: this.project
    // });
    // var ShowAssetSizesTask = this.tasks.ShowAssetSizes;
    // var showTask = new ShowAssetSizesTask({
    //   ui: this.ui
    // });
    //
    // return win.checkWindowsElevation(this.ui).then(function () {
    //   return buildTask.run(commandOptions)
    //     .then(function () {
    //       if (!commandOptions.suppressSizes && commandOptions.environment === 'production') {
    //         return showTask.run({
    //           outputPath: commandOptions.outputPath
    //         });
    //       }
    //     });
    // });


  return new Promise((resolve) => {
    webpack({
      resolve: {
        extensions: ['', '.css', '.scss', '.ts', '.js']
      },

      plugins: [
        //   new LiveReloadPlugin({
        //     appendScriptTag: true
        //   })
      ],

      entry: path.resolve(process.cwd(), './src/main.ts'),
      output: {
        path: "./dist",
        publicPath: 'dist/',
        filename: "bundle.js"
      },
      ts: {
        configFileName: './src/tsconfig.json'
      },

      // devtool: 'source-map',

      module: {
        loaders: [
          {
            test: /\.ts$/,
            loader: 'ts-loader'
          },
          {
            test: /\.css$/,
            loader: 'style-loader'
          }
        ]
      },

      devServer: {
        historyApiFallback: true
      }
    }, function (err, stats) {
      resolve();
      console.log(err);
      console.log(stats);
      console.log('--------');
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
