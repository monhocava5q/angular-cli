import {webpackCommonConfig, webpackOutputOptions} from '../models/webpack-build-config.ts';

webpackCommonConfig.entry.main.unshift("webpack-dev-server/client?http://localhost:8080/");

const Task              = require('ember-cli/lib/models/task');
const webpack           = require('webpack');
const WebpackDevServer  = require('webpack-dev-server');
const webpackCompiler   = webpack(webpackCommonConfig);
const ProgressPlugin    = require('webpack/lib/ProgressPlugin');

const server = new WebpackDevServer(webpackCompiler);






server.listen(8080);
