const path        = require('path');
const stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: '',
  
  availableOptions: [
    { name: 'source-dir', type: String, default: 'src', aliases: ['sd'] },
    { name: 'prefix', type: String, default: 'app', aliases: ['p'] }
  ],

  locals: function(options) {
    //TODO: pull value from config
    this.styleExt = 'css';
    this.version = require(path.resolve(__dirname, '..', '..', '..', '..', 'package.json')).version;
    
    // Join with / not path.sep as reference to typings require forward slashes.
    const refToTypings = options.sourceDir.split(path.sep).map(() => '..').join('/');
    return {
      htmlComponentName: stringUtils.dasherize(options.entity.name),
      jsComponentName: stringUtils.classify(options.entity.name),
      styleExt: this.styleExt,
      version: this.version,
      sourceDir: options.sourceDir,
      prefix: options.prefix,
      refToTypings: refToTypings
    };
  },
  
  fileMapTokens: function (options) {
    // Return custom template variables here.
    return {
      __path__: () => {
        return options.locals.sourceDir;
      },
      __styleext__: () => {
        return options.locals.styleExt;
      }
    };
  }
};
