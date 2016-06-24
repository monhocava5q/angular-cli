import * as webpack from 'webpack';
import {webpackCommonConfig} from '../models/';
import {webpackMaterialConfig, webpackMaterialE2EConfig} from './webpack-build-material2';
import {ngAppResolve} from '../models/webpack-build-utils';

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const WebpackMd5Hash = require('webpack-md5-hash');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'); //TODO WP2 Typings
const CompressionPlugin = require("compression-webpack-plugin");




export const webpackProdConfigPartial = {
  debug: false,
  devtool: 'source-map',
  output: {
    path: ngAppResolve('./dist'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false, //prod
      mangle: { screw_ie8 : true }, //prod
      compress: { screw_ie8: true }, //prod
      comments: false //prod
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new LoaderOptionsPlugin({
      test: /\.js/,
      minimize: true,
      optimize: true,
      debug: false
    })
  ],
  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: ngAppResolve('./src')
  },
  htmlLoader: {
    minimize: true,
    removeAttributeQuotes: false,
    caseSensitive: true,
    customAttrSurround: [
      [/#/, /(?:)/],
      [/\*/, /(?:)/],
      [/\[?\(?/, /(?:)/]
    ],
    customAttrAssign: [/\)?\]?=/]
  },
  node: {
    global: 'window',
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};


export const webpackProdConfig = webpackMerge(webpackCommonConfig, webpackProdConfigPartial);

// @angular-material custom builds demo-app and e2e
export const webpackProdMaterialConfig = webpackMerge(webpackMaterialConfig, webpackProdConfigPartial);
export const webpackProdMaterialE2EConfig = webpackMerge(webpackMaterialE2EConfig, webpackProdConfigPartial);


