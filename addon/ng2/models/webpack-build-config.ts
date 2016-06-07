const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');


// Resolve to the generated applications
function ngAppResolve(resolvePath: string): string {
  return path.resolve(process.cwd(), resolvePath);
}

// Webpack Configuration Object
// Used in build.ts
module.exports = {
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
            }
          },
          {
            loader: 'angular2-template-loader'
          }
        ]
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
    // Automatically manages the addition of bundle scripts to your index.html template.
    // Also allows index.html to be used in src/ and watched
    new HtmlWebpackPlugin({
      template: ngAppResolve('./src/index.html'),
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      jsfile: true
    })
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT5',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'SIMPLE'
      },
      concurrency: 3,
    })
  ],

  // ts: {
  //   configFileName: ngAppResolve('./src/tsconfig.json'),
  //   silent: true
  // },

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
