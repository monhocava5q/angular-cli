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
  // or: contentBase: "http://localhost/",

  hot?: boolean;
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback?: boolean;

  // Set this if you want to enable gzip compression for assets
  compress?: boolean;

  // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
  // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  proxy?: {[key: string] : string};

  // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
  staticOptions?: any;
  // webpack-dev-middleware options
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
}

// Webpack Configuration Object
// Used in build.ts
export const webpackCommonConfig = {
  cache: false,
  // Resolve loaders from the CLI node_modules rather than the projects
  context: path.resolve(__dirname, './'),
  entry: {
    main: ngAppResolve('./src/main.ts'),
    vendor: ngAppResolve('./src/vendor.ts'),
    polyfills: ngAppResolve('./src/polyfills.ts')
  },

  output: {
    path: './dist',
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
              resolveGlobs: false
              // module: "es6",
              // target: "es5",
              // lib: ["es6", "dom"]
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
