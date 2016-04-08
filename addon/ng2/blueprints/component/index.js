var path = require('path');
var Blueprint = require('ember-cli/lib/models/blueprint');
var dynamicPathParser = require('../../utilities/dynamic-path-parser');

var getFiles = Blueprint.prototype.files;

module.exports = {
  description: '',
  
  availableOptions: [
    { name: 'flat', type: Boolean, default: false }
  ],

  normalizeEntityName: function (entityName) {
    var parsedPath = dynamicPathParser(this.project, entityName);

    this.dynamicPath = parsedPath;
    return parsedPath.name;
  },

  locals: function (options) {
    //TODO: pull value from config
    this.styleExt = 'css';
    
    return {
      dynamicPath: this.dynamicPath.dir.replace(this.dynamicPath.appRoot, ''),
      flat: options.flat,
      styleExt: this.styleExt,
      isLazyRoute: !!options.isLazyRoute,
      isAppComponent: !!options.isAppComponent
    };
  },
  
  files: function() {
    var fileList = getFiles.call(this);
    
    if (this.options.flat) {
      fileList = fileList.filter(p => p.indexOf('index.ts') <= 0);
    }

    return fileList;
  },
  
  fileMapTokens: function (options) {
    // Return custom template variables here.
    return {
      __path__: () => {
        var dir = this.dynamicPath.dir;
        if (!options.locals.flat) {
          dir += path.sep + options.dasherizedModuleName;
          
          if (options.locals.isLazyRoute) {
            var dirParts = dir.split(path.sep);
            dirParts[dirParts.length - 1] = `+${dirParts[dirParts.length - 1]}`;
            dir = dirParts.join(path.sep);
          }
        }
        this.appDir = dir.replace(`src${path.sep}client${path.sep}`, '');
        return dir;
      },
      __styleext__: () => {
        return options.locals.styleExt;
      }
    };
  },
  
  afterInstall: function(options) {
    if (!options.flat) {
      var filePath = path.join('src', 'client', 'system-config.ts');
      var barrelUrl = this.appDir.replace(path.sep, '/');
      return this.insertIntoFile(
        filePath,
        `  '${barrelUrl}',`,
        { before: '  /** @cli-barrel */' }
      );
    }
  }
};
