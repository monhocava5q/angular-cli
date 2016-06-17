import * as webpack from 'webpack';
import {ngAppResolve} from './webpack-build-utils';

const path = require("path");

export const webpackVendorDLLConfig = {
    entry: {
        polyfills: [ngAppResolve('./src/polyfills.ts')],
        vendor: [ngAppResolve('./src/vendor.ts')]
    },
    output: {
        path: path.join(__dirname, "dist", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
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
          }]
        }
    plugins: [
        new webpack.LoaderOptionsPlugin({
          test: /\.js/,
          minimize: true,
          optimize: true,
          debug: false
        }),
        new webpack.DllPlugin({
            path: path.resolve('../models/', "webpack-build-manifest.json"),
            name: "[name]_[hash]"
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin()
    ],
    resolve: {
        root: path.resolve(__dirname, "client"),
        modulesDirectories: ["node_modules"]
    }
}
