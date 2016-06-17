const path = require('path');
const autoprefixer = require('autoprefixer');

import {webpackDevConfig, webpackProdConfig, webpackVendorDLLConfig} from './';

export const ngAppResolve = (resolvePath: string): string => {
  return path.resolve(process.cwd(), resolvePath);
}

export const webpackOutputOptions: WebpackProgressPluginOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
}

export const postCssConfiguration = () => {
  return {
    defaults: [autoprefixer]
  };
}

export const envToConfigMap: any = {
  production: webpackProdConfig,
  development: webpackDevConfig,
  vendor: webpackVendorDLLConfig
}
