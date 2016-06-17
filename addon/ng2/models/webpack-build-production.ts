import * as webpack from 'webpack';
import {ngAppResolve} from './webpack-build-utils';

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack-build-common'); // the settings that are common to prod and dev
const WebpackMd5Hash = require('webpack-md5-hash');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'); //TODO WP2 Typings

export const webpackProdConfig = webpackMerge(commonConfig, {
  debug: false,
  devtool: 'source-map',
  output: {
    path: ngAppResolve('dist'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'

  },
  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false, //prod
    //   mangle: { screw_ie8 : true }, //prod
    //   compress: { screw_ie8: true }, //prod
    //   comments: false //prod
    // }),
    new LoaderOptionsPlugin({
      test: /\.js/,
      minimize: true,
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
});
