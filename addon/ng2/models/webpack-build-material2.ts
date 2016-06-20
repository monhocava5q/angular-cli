import * as webpack from 'webpack';
import {ngAppResolve} from './webpack-build-utils';

const path = require('path');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DebugWebpackPlugin = require('debug-webpack-plugin');


var components = [
    'button',
    'card',
    'checkbox',
    'grid-list',
    'icon',
    'input',
    'list',
    'progress-bar',
    'progress-circle',
    'radio',
    'sidenav',
    'slide-toggle',
    'button-toggle',
    'tabs',
    'toolbar'
];
/** Map relative paths to URLs. */
var aliasMap = {
    '@angular2-material/core': ngAppResolve('./src/core'),
};

components.forEach(function (name) {
  aliasMap[("@angular2-material/" + name)] = ngAppResolve("./src/components/" + name);
  return aliasMap[("@angular2-material/" + name)] = ngAppResolve("./src/components/" + name);
});

export const webpackMaterialConfig = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css', '.scss'],
    //SAVE: TODO# Don't use relative bp
    root: ngAppResolve('./'),
    // modulesDirectory: [
    //   ngAppResolve('./src/demo-app/'),
    //   ngAppResolve('./src/core'),
    //   ngAppResolve('./src/components'),
    //   'src/components/',
    //   'src/core/'
    // ]
    alias: aliasMap
  },
  debug: true,
  context: path.resolve(__dirname, './'),
  //SAVE entry: {
  //   main: [ngAppResolve('./src/main.ts')],
  //   vendor: ngAppResolve('./src/vendor.ts'),
  //   polyfills: ngAppResolve('./src/polyfills.ts')
  // },
  entry: {
    main: [ngAppResolve('./src/demo-app/main.ts')],
    // core: ngAppResolve('./src/core/core.ts'),
    // main: ngAppResolve('./src/e2e-app/main.ts')
  },
  output: {
    path: './dist',
    filename: '[name].bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          ngAppResolve('node_modules/rxjs'),
          ngAppResolve('node_modules/@angular'),
        ]
      }
    ],
    ts: {
      configFileName: ngAppResolve('./src/demo-app/tsconfig.json')
    },
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          'ts-loader', 'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
      { test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
      { test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
      { test: /\.s?css$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    // new webpack.NormalModuleReplacementPlugin(/@angular2-material\/core/, require.resolve(ngAppResolve('./src/core/core.ts'))),
    // new webpack.NormalModuleReplacementPlugin(/@angular2-material\//, ngAppResolve('./src/components')),
    new DebugWebpackPlugin({
      // Defaults to ['webpack:*'] which can be VERY noisy, so try to be specific
      // scope: [
      //   'webpack:compiler:*', // include compiler logs
      //   'webpack:plugin:ExamplePlugin' // include a specific plugin's logs
      // ],

      // // Inspect the arguments passed to an event
      // // These are triggered on emits
      // listeners: {
      //   'webpack:compiler:run': function(compiler) {
      //     // Read some data out of the compiler
      //   }
      // },
      // Defaults to the compiler's setting
      debug: true
    }),
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: ngAppResolve('./src/demo-app/index.html'),
    }),
  ],
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
