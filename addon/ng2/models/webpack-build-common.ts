import * as webpack from 'webpack';
import {ngAppResolve} from './webpack-build-utils';

const path = require('path');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DebugWebpackPlugin = require('debug-webpack-plugin');

export const webpackCommonConfig = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: ngAppResolve('./src')
  },
  debug: true,
  context: path.resolve(__dirname, './'),
  entry: {
    main: [ngAppResolve('./src/main.ts')],
    vendor: ngAppResolve('./src/vendor.ts'),
    polyfills: ngAppResolve('./src/polyfills.ts')
  },
  output: {
    path: ngAppResolve('./dist'),
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
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              tsconfig: ngAppResolve('./src/tsconfig.json'),
              // resolveGlobs: false,
              module: "es2015",
              target: "es5",
              lib: ['es6', 'dom'],
              useForkChecker: true
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
      { test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
      { test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
      { test: /\.scss$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({
      template: ngAppResolve('src/index.html'),
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      name: 'inline',
      filename: 'inline.js',
      sourceMapFilename: 'inline.map'
    }),
    new CopyWebpackPlugin([{from: ngAppResolve('./public'), to: ngAppResolve('./dist/public')}])
  ],
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
