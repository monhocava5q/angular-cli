import { webpackCommonConfig } from './webpack-build-common';
import { ngAppResolve } from './webpack-build-utils';

const webpackMerge = require('webpack-merge');

export const webpackDevConfig = webpackMerge(webpackCommonConfig, {
  debug: true,
  devtool: 'cheap-module-source-map',
  output: {
    path: ngAppResolve('./dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: ngAppResolve('./src')
  },
  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
