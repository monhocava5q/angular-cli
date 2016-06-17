const path = require('path');
const autoprefixer = require('autoprefixer');

export function ngAppResolve(resolvePath: string): string {
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
