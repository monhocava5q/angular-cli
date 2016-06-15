const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');


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
          {
            loader: 'babel-loader', //TODO: Remove Babel once support for lib: for typescript@next
            query: {
              presets: [
                'babel-preset-es2015-webpack'
              ].map(require.resolve)
            }
          },
          {
            loader: 'awesome-typescript-loader',
            query: {
              useWebpackText: true,
              tsconfig: ngAppResolve('./src/tsconfig.json'),
              resolveGlobs: false,
              module: "es2015",
              target: "es5"
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
      // TODO: https://github.com/webpack/css-loader#sourcemaps
      // Style sourcemaps create a runtime and bundle overhead.
      // Do we want this?

      // We pass sourcemap flag (on external builds [not from my dev] this will not work because of)
      // https://github.com/webpack/raw-loader/pull/8
      {
        test: /\.css$/,
        loaders: ['raw-loader', 'postcss-loader']
      },
      {
        test:/\.styl$/,
        loaders: ['raw-loader', 'postcss-loader', 'stylus-loader?sourceMap']
      },
      {
        test:/\.less$/,
        loaders: ['raw-loader', 'postcss-loader', 'less-loader?sourceMap']
      },
      {
        test:/\.scss$/,
        loaders: ['raw-loader', 'postcss-loader', 'sass-loader?sourceMap']
      },
      // Asset loaders
      //
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader?limit=25000', // Only inline for sizes <= 25000
        include: PATHS.images
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
        include: PATHS.images
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        include: PATHS.images
      }
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  postcss: () => {
      return {
        defaults: [cssnano, autoprefixer]
      };
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
