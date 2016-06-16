const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

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
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          // {
          //   loader: 'babel-loader', //TODO: Remove Babel once support for lib: for typescript@next
          //   query: {
          //     presets: [
          //       'babel-preset-es2015-webpack'
          //     ].map(require.resolve)
          //   }
          // },
          {
            loader: 'awesome-typescript-loader',
            query: {
              useWebpackText: true,
              tsconfig: ngAppResolve('./src/tsconfig.json'),
              resolveGlobs: false,
              module: "es2015",
              target: "es5",
              library: 'es6',
              useForkChecker: true
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
        loaders: ['raw-loader', 'postcss-loader']
      },
      {
        test:/\.styl$/,
        loaders: ['raw-loader', 'postcss-loader', 'stylus-loader']
      },
      {
        test:/\.less$/,
        loaders: ['raw-loader', 'postcss-loader', 'less-loader']
      },
      {
        test:/\.scss$/,
        loaders: ['raw-loader', 'postcss-loader', 'sass-loader']
      },
      //
      // Asset loaders
      //
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader?limit=25000', // Only inline for sizes <= 25000
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  postcss: () => {
      return {
        defaults: [autoprefixer]
      };
  },
  plugins: [
    new ForkCheckerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new HtmlWebpackPlugin(baseHtmlTemplateConfig),
    new CopyWebpackPlugin([{from: ngAppResolve('./public'), to: ngAppResolve('./dist/public')}])
  ],
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: ngAppResolve('./src')
    // modulesDirectories: ['node_modules']
  }
};
