const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
    path: "./dist",
    filename: "[name].bundle.js"
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
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
    })
  ],

  ts: {
    configFileName: ngAppResolve('./src/tsconfig.json'),
    silent: true
  },

  resolve: {
    extensions: ['', '.css', '.scss', '.ts', '.js']
  },

  devServer: {
    historyApiFallback: true
  }

  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
