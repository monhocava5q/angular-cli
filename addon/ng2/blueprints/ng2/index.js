const Blueprint   = require('ember-cli/lib/models/blueprint');
const path        = require('path');
const stringUtils = require('ember-cli-string-utils');

module.exports = {
  description: '',

  availableOptions: [
    { name: 'source-dir', type: String, default: 'src', aliases: ['sd'] },
    { name: 'prefix', type: String, default: 'app', aliases: ['p'] },
    { name: 'mobile', type: Boolean, default: false }
  ],

  afterInstall: function (options) {
    if (options.mobile) {
      return Blueprint.load(path.join(__dirname, '../mobile')).install(options);
    }
  },

  locals: function(options) {
    //TODO: pull value from config
    this.styleExt = 'css';
    this.version = require(path.resolve(__dirname, '..', '..', '..', '..', 'package.json')).version;

    // Join with / not path.sep as reference to typings require forward slashes.
    const refToTypings = options.sourceDir.split(path.sep).map(() => '..').join('/');
    const fullAppName = stringUtils.dasherize(options.entity.name)
      .replace(/-(.)/g, (_, l) => ' ' + l.toUpperCase())
      .replace(/^./, (l) => l.toUpperCase());

    return {
      htmlComponentName: stringUtils.dasherize(options.entity.name),
      jsComponentName: stringUtils.classify(options.entity.name),
      fullAppName: fullAppName,
      styleExt: this.styleExt,
      version: this.version,
      sourceDir: options.sourceDir,
      prefix: options.prefix,
      refToTypings: refToTypings,
      isMobile: options.mobile
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
