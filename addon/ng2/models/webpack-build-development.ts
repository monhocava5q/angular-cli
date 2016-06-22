import { webpackCommonConfig } from '../models';
import { webpackMaterialConfig, webpackMaterialE2EConfig } from './webpack-build-material2';
import { ngAppResolve } from './webpack-build-utils';

const webpackMerge = require('webpack-merge');

const devConfigPartial = {
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
}

export const webpackDevConfig = webpackMerge(webpackCommonConfig, devConfigPartial);

export const webpackDevMaterialConfig = webpackMerge(webpackMaterialConfig, devConfigPartial);

export const webpackDevMaterialE2EConfig = webpackMerge(webpackMaterialE2EConfig, devConfigPartial);
