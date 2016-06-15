
// new webpack.LoaderOptionsPlugin({
//   minimize: true
// }),
// new webpack.LoaderOptionsPlugin({
//   test: /\.js$/,
//   jsfile: true
// })
// new ClosureCompilerPlugin({
//   compiler: {
//     language_in: 'ECMASCRIPT5',
//     language_out: 'ECMASCRIPT5',
//     compilation_level: 'SIMPLE'
//   },
//   concurrency: 3,
// })




// ts: {
//   configFileName: ngAppResolve('./src/tsconfig.json'),
//   silent: true
// },
// output: {
//   path: './dist/',
//   filename: '[name].[chunkhash].js',
//   sourceMapFilename: '[name].[chunkhash].map',
//   chunkFilename: '[chunkhash].js'
// },
// recordsPath: path.join(__dirname, "records.json"),
//
//
//
//
// new webpack.optimize.CommonsChunkPlugin({
//   names: ['main', 'vendors', 'polyfills']
// }),
// new webpack.optimize.CommonsChunkPlugin({
//   minChunks: Infinity,
//   name: 'inline',
//   filename: 'inline.js',
//   sourceMapFilename: 'inline.map'
// }),
// new HtmlWebpackPlugin({
//   template:'./src/index.html',
//   chunksSortMode: "dependency"
// })
//
//
// export const materialEntryConfig: {[key: string]: any} = {
//   demoMain: [ngAppResolve('./src/demo-app/main.ts')],
//   e2eMain: [ngAppResolve('./src/e2e-app/main.ts')],
//   core: [ngAppResolve('./src/core/core.ts')],
//   vendor: [
//     "@angular/common",
//     "@angular/compiler",
//     "@angular/core",
//     "@angular/http",
//     "@angular/platform-browser",
//     "@angular/platform-browser-dynamic",
//     "@angular/router",
//   ],
//   polyfills: [
//     "core-js",
//     "hammerjs",
//     "rxjs",
//     "systemjs",
//     "zone.js"
//   ]
// }

// export const materialPluginsConfig: any[] = [
//     new webpack.optimize.CommonsChunkPlugin({
//       name: ['polyfills', 'vendor'].reverse()
//     }),
//     new HtmlWebpackPlugin({
//       template: ngAppResolve('./demo-app/index.html'),
//       chunksSortMode: 'dependency'
//     })
// ];

