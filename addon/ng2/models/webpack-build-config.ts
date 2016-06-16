const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const webpackMerge = require('webpack-merge');

// Resolve to the generated applications
function ngAppResolve(resolvePath: string): string {
  return path.resolve(process.cwd(), resolvePath);
}

let baseHtmlTemplateConfig = {
  template: ngAppResolve('./src/index.html'),
  chunksSortMode: 'dependency'
};

// These are the output
export const webpackOutputOptions: WebpackProgressPluginOutputOptions = {
  colors: true,
  chunks: true,
  modules: false,
  reasons: false,
  chunkModules: false
}

const webpackTestPartial = {
  module: {
    plugins: [
      new ForkCheckerPlugin(),
      new HtmlWebpackPlugin(baseHtmlTemplateConfig),
    ],
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: ['node_modules']
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
        // these packages have problems with their sourcemaps
        ngAppResolve('node_modules/rxjs'),
        ngAppResolve('node_modules/@angular')
      ]}
    ],
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              useWebpackText: true,
              tsconfig: ngAppResolve('./src/tsconfig.json'),
              resolveGlobs: false,
              module: "es2015",
              target: "es5",
              library: 'es6',
              useForkChecker: true,
              removeComments: true
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      { test: /\.json$/, loader: 'json-loader', exclude: [ngAppResolve('src/index.html')] },
      { test: /\.css$/, loader: 'raw-loader', exclude: [ngAppResolve('src/index.html')] },
      { test: /\.html$/, loader: 'raw-loader', exclude: [ngAppResolve('src/index.html')] }
    ]
  },
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },
  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

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
  devtool: 'sourcemap',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
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
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
      { test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
      { test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
      { test: /\.scss$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
      { test: /\.html$/, loader: 'raw-loader' }
    ]
  },
  postcss: () => {
      return {
        defaults: [autoprefixer]
      };
  },
  plugins: [
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin(baseHtmlTemplateConfig),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new CopyWebpackPlugin([{from: ngAppResolve('./public'), to: ngAppResolve('./dist/public')}])
  ],
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: ngAppResolve('./src')
  }
};

export const webpackTestConfig = webpackMerge(webpackTestPartial, webpackCommonConfig);








