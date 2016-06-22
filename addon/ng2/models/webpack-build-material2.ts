// Angular Material2 Custom CLI Webpack Plugin: This allows for the following:
// To build, serve, and watchmode the angular2-material repo.
//
// Requirements:
//
// Do a find and replace on the src directory
// .css'] => .scss']
// This allows for angular2-template-loader to transpile the sass correctly.

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
var aliasMap: any = {
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
    root: ngAppResolve('./'),
    alias: aliasMap
  },
  sassLoader: {
    includePaths: [
        // This allows for automatic resolving of @import's for sass for variables.
        ngAppResolve('./src/core/style')
    ]
  },
  debug: true,
  context: path.resolve(__dirname, './'),
  entry: {
    main: [ngAppResolve('./src/demo-app/main.ts')],
    vendor: ngAppResolve('./src/demo-app/vendor.ts')
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
      { test: /\.less$/, loaders: ['raw-loader', 'less-loader'] },
      { test: /\.s?css$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    // new DebugWebpackPlugin({
    //   // Defaults to ['webpack:*'] which can be VERY noisy, so try to be specific
    //   // scope: [
    //   //   'webpack:compiler:*', // include compiler logs
    //   //   'webpack:plugin:ExamplePlugin' // include a specific plugin's logs
    //   // ],

    //   // // Inspect the arguments passed to an event
    //   // // These are triggered on emits
    //   // listeners: {
    //   //   'webpack:compiler:run': function(compiler) {
    //   //     // Read some data out of the compiler
    //   //   }
    //   // },
    //   // Defaults to the compiler's setting
    //   debug: true
    // }),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: ngAppResolve('./src/demo-app/index.html'),
      chunksSortMode: 'dependency'
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

export const webpackMaterialE2EConfig = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css', '.scss'],
    root: ngAppResolve('./'),
    alias: aliasMap
  },
  sassLoader: {
    includePaths: [
        // This allows for automatic resolving of @import's for sass for variables.
        ngAppResolve('./src/core/style')
    ]
  },
  debug: true,
  context: path.resolve(__dirname, './'),
  entry: {
    main: [ngAppResolve('./src/demo-app/main.ts')],
    vendor: ngAppResolve('./src/demo-app/vendor.ts')
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
      { test: /\.less$/, loaders: ['raw-loader', 'less-loader'] },
      { test: /\.s?css$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    // new DebugWebpackPlugin({
    //   // Defaults to ['webpack:*'] which can be VERY noisy, so try to be specific
    //   // scope: [
    //   //   'webpack:compiler:*', // include compiler logs
    //   //   'webpack:plugin:ExamplePlugin' // include a specific plugin's logs
    //   // ],

    //   // // Inspect the arguments passed to an event
    //   // // These are triggered on emits
    //   // listeners: {
    //   //   'webpack:compiler:run': function(compiler) {
    //   //     // Read some data out of the compiler
    //   //   }
    //   // },
    //   // Defaults to the compiler's setting
    //   debug: true
    // }),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: ngAppResolve('./src/demo-app/index.html'),
      chunksSortMode: 'dependency'
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

