const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');


// Resolve to the generated applications
function ngAppResolve(resolvePath: string): string {
  return path.resolve(process.cwd(), resolvePath);
}

let baseHtmlTemplateConfig = {
  template: ngAppResolve('./src/index.html'),
  chunksSortMode: 'dependency'
};

// These are the output
export const webpackOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
}

export interface IWebpackDevServerConfigurationOptions {
  contentBase?: string;
  hot?: boolean;
  historyApiFallback?: boolean;
  compress?: boolean;
  proxy?: {[key: string] : string};
  staticOptions?: any;
  quiet?: boolean;
  noInfo?: boolean;
  lazy?: boolean;
  filename?: string;
  watchOptions?: {
    aggregateTimeout?: number;
    poll?: number;
  },
  publicPath?: string;
  headers?: { [key:string]: string };
  stats?: { colors: boolean; };
  inline: boolean;
}

// Webpack Configuration Object
// Used in build.ts
export const webpackCommonConfig = {
  cache: false,
  // Resolve loaders from the CLI node_modules rather than the projects
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
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'babel-preset-es2015-webpack'
              ].map(require.resolve)
            }
          }
          {
            loader: 'awesome-typescript-loader',
            query: {
              useWebpackText: true,
              tsconfig: ngAppResolve('./src/tsconfig.json'),
              resolveGlobs: false,
              module: "es6",
              target: "es5",
              lib: ["es6", "dom"]
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new HtmlWebpackPlugin(baseHtmlTemplateConfig)
  ],
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: ngAppResolve('./src')
    // modulesDirectories: ['node_modules']
  },
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
