/* jshint node: true */
'use strict';

var Promise     = require('ember-cli/lib/ext/promise');
var Task        = require('ember-cli/lib/models/task');
var npm         = require('ember-cli/lib/utilities/npm');
var existsSync  = require('exists-sync');
var chalk       = require('chalk');
var path        = require('path');
var fs          = require('fs');
var _           = require('lodash');
var glob        = require('glob');
var appRoot     = path.resolve('./src');
var nodeModules = path.resolve('./node_modules');
var checkDirs   = ['components', 'providers', 'directives', 'pipes'];

module.exports = Task.extend({
  command: '',
  completionOKMessage: '',
  completionErrorMessage: 'Error installing packages. Did you misspelt it?',

  init: function() {
    this.npm = this.npm || require('npm');
  },
  run: function(options) {
    this.packages = options.packages || [];
    this.skipInjection = options.skipInjection || false;
    this.autoInjection = options.autoInjection || false;
    this.disableLogger();

    this.ui.startProgress(chalk.green('Installing 3rd party package:', 
      this.packages.join(', ')), chalk.green('.'));

    this.npmOptions = {
      logLevel: 'error',
      logstream: this.ui.outputStream,
      color: 'always',
      optional: true,
      'save-dev': true,
      'save-exact': !!options['save-exact']
    };

    return npm('install', this.packages, this.npmOptions, this.npm)
      .then(function(npmresp) {
        if (this.skipInjection) {
          return this.announceOKCompletion();
        }

        return this.installProcedure(this.autoInjection)
          .then(function(resp) {
            return this.announceOKCompletion();
          }.bind(this));
      }.bind(this));
  },

  installProcedure: function(autoInjection) {
    var allPackages         = {};
    allPackages.toUninstall = [];
    allPackages.toProcess   = [];
    var pkgSrcPath;
    var pkgDirs;

    return new Promise(function(resolve, reject) {
      this.packages.forEach(function(pkgName) {
        if (this.checkIfPackageIsAuthentic(pkgName)) {
          allPackages.toProcess.push(pkgName);
        }
        else {
          allPackages.toUninstall.push(pkgName);
        }

        if (allPackages.toUninstall.length) {
          var msg = 'Removing packages which were not recognized ' +
          'as authentic: ' + allPackages.toUninstall.join(', ');
          this.ui.writeLine(chalk.yellow(msg));

          return npm('uninstall', allPackages.toUninstall, this.npmOptions, this.npm)
            .then(function() {
              return this.processPackages(allPackages.toProcess, autoInjection)
                .then(function(resp) {
                  resolve(resp);
                });
            }.bind(this));
        }
        else {
          return this.processPackages(allPackages.toProcess, autoInjection)
            .then(function(resp) {
              resolve(resp);
            });
        }

      }.bind(this));
    }.bind(this));
  },

  processPackages: function (packages, autoInjection) {
    if (!packages.length) {
      this.ui.writeLine(chalk.yellow('No package to process. Quitting.'));
      return Promise.resolve();
    } else {
      this.ui.writeLine(chalk.green('Package successfully installed.'));
      this.ui.writeLine('');

      if (autoInjection) {
        if (existsSync(path.resolve(process.cwd(), 'src', 'app.ts'))) {
          var entryPoint = path.resolve(process.cwd(), 'src', 'app.ts');
          var packageData = this.parseFile(this.packages[0]);
          this.importInBootstrap(entryPoint, this.packages[0], packageData);
        }

        return Promise.resolve(); 
      }

      return this.ui.prompt({
        type: 'text',
        name: 'confirm',
        message: 'Would you like to inject the installed packages into your app automatically? (N/y)',
        default: function() { return 'N'; },
        validate: function(value) {
          return /[YN]/i.test(value) ? true : 'Enter Y(es) or N(o)';
        }
      })
      .then(function(answer) {
        if (answer.confirm.toLowerCase().substring(0, 1) === 'n') {
          return Promise.resolve();
        }
        else {
          return this.ui.prompt({
            type: 'text',
            name: 'entry',
            message: 'What is the path to the file which bootstraps your app?',
            default: function() {
              if (existsSync(path.join(appRoot, 'app.ts'))) {
                return path.join(appRoot, 'app.ts');
              } else {
                var possibleFiles = glob.sync(appRoot, '*.ts');
                if (possibleFiles.length) {
                  return possibleFiles[0];
                } else {
                  return '';
                }
              }
            },
            validate: function(val) {
              return (existsSync(val)) ? true : 'File not exists.';
            }
          })
          .then(function(boot) {
            var entryPoint = boot.entry;
            return packages.reduce(function(promise, packageName) {
              return promise.then(function() {
                return this.parsePackage(packageName, entryPoint, autoInjection);
              }.bind(this));
            }.bind(this), Promise.resolve());
          }.bind(this));
        }
      }.bind(this));
        
    }
  },

  parsePackage: function (packageName, entryPoint, autoInjection) {
    return new Promise(function(resolve, reject) {
      var packageData;

      if (autoInjection) {
        packageData = this.parseFile(packageName);
        this.importInBootstrap(entryPoint, packageName, packageData);
        return resolve();
      }

      this.ui.writeLine('');

      var msg = 'Would you like to customize the injection of ' + 
      chalk.yellow(path.basename(packageName)) + '? (N/y)';

      return this.ui.prompt({
        type: 'input',
        name: 'option',
        message: msg,
        default: function () { return 'N'; },
        validate: function(value) {
          return /[YN]/i.test(value) ? true : 'Enter Y(es) or N(o)';
        }
      })
      .then(function(answer) {
        if (answer.option.toLowerCase().substring(0, 1) === 'y') {
          packageData = this.parseFile(packageName);
          this.importInBootstrap(entryPoint, packageName, packageData);

          return this.customImport(packageName)
            .then(function() {
              return resolve();
            });
        }
        else {
          packageData = this.parseFile(packageName);
          this.importInBootstrap(entryPoint, packageName, packageData);

          return resolve();
        }
      }.bind(this));
    }.bind(this));
  },

  customImport: function (packageName) {
    return new Promise(function(resolve, reject) {
      var componentType;
      var componentIndex;
      var fileIndex;
      var componentKey;
      var msg;

      var packageData = this.parseFile(packageName);

      msg = 'What would you like to inject from ' + chalk.yellow(path.basename(packageName)) + '?';
      Object.keys(packageData).forEach(function(item, index) {
        msg += '\n' + chalk.green(index + 1) + ' ' + item;
      });
      msg += '\n' + chalk.green('-----------');
      msg += '\n' + chalk.green('q') + ' Quit';
      msg += '\nEnter value:';

      return this.ui.prompt({
        type: 'input',
        name: 'component',
        message: msg,
        validate: function(value) {
          return (value > 0 && value <= Object.keys(packageData).length) ||
                  value === 'q' ? true : 'Enter a valid value';
        }
      })
      .then(function(choice) {
        componentType = choice.component;

        if (componentType.toLowerCase() === 'q') {
          return resolve();
        }

        Object.keys(packageData).forEach(function(item, index) {
          if ((index + 1) === parseInt(componentType, 10)) {
            componentKey = item;
          }
        });

        msg = '\nWhich ' + componentKey + ' would you like to inject?';
        packageData[componentKey].forEach(function(item, index) {
          msg += '\n' + chalk.green(index + 1) + ' ' + item;
        });
        msg += '\nEnter value:';

        return this.ui.prompt({
          type: 'input',
          name: 'sel',
          message: msg,
          filter: function (val) { return val.trim(); }, 
          validate: function(value) {
            return value > 0 && value <= packageData[componentKey].length ? true : 'Enter a valid value';
          }
        })
        .then(function(choice) {
          componentIndex = choice.sel - 1;

          msg = '\nWhere would you like to inject it?';
          var possibleFiles = glob.sync(appRoot + '/**/*.ts').sort();
          possibleFiles.forEach(function(file, index) {
            msg += '\n' + chalk.green(index + 1) + ' ' + file;
          });
          msg += '\nEnter value:';

          return this.ui.prompt({
            type: 'input',
            name: 'file',
            message: msg,
            validate: function(value) {
              return value > 0 && value <= possibleFiles.length ? true : 'Enter a valid value';
            }
          })
          .then(function(choice) {
            fileIndex = choice.file - 1;

            this.ui.writeLine(chalk.yellow('Injecting', componentKey +
            ' (' + packageData[componentKey][componentIndex] + ') to', possibleFiles[fileIndex]));


            this.injectImport(possibleFiles[fileIndex],
                              packageName,
                              packageData[componentKey][componentIndex]);

            this.injectItem(componentKey.toLowerCase(), 
                            packageData[componentKey][componentIndex], 
                            possibleFiles[fileIndex]);

            this.ui.writeLine(chalk.green('Successfully injected.'));
            this.ui.writeLine('');

            this.customImport(packageName);

          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  injectImport: function(entryPoint, packageName, component) {
    var contents = fs.readFileSync(entryPoint, 'utf8');
    var contentsArr = flatImportLines(contents.split('\n'));
    var alreadyInFile = importAlreadyInFile(contentsArr, packageName);
    var match;
    var imports;
    var lastIndex;

    if (alreadyInFile) {
      var importLine = contentsArr[alreadyInFile];
      match = importLine.match(/\{(.*?)\}/)[0].replace(/[ \{\}]/g, '').split(',');
      match.push(component);
      imports = 'import {' + match.join(', ') + '} from \'' + packageName + '\';';
      contentsArr[alreadyInFile] = imports;
    }
    else {
      lastIndex = getLastImportIndex(contentsArr);
      imports = 'import {' + component + '} from \'' + packageName + '\';';
      contentsArr.splice(lastIndex + 1, 0, imports);
    }

    fs.writeFileSync(entryPoint, contentsArr.join('\n'), 'utf8');

    function getLastImportIndex(arr) {
      var lastImportIndex;

      arr.forEach(function(line, index) {
        if (/import/.test(line) && /;/.test(line)) {
          lastImportIndex = index;
        }
      });

      return lastImportIndex;
    }

    function importAlreadyInFile(arr, packageName) {
      var inLine = false;
      var checkRegex = new RegExp(packageName, 'i');

      arr.forEach(function(line, index) {
        if (/import/.test(line) && /;/.test(line) && checkRegex.test(line)) {
          inLine = index;
        }
      });

      return inLine;
    }

    function flatImportLines(arr) {
      var removeNextLine = false;

      arr.forEach(function(line, index) {
        if (/import/.test(line) && !/;/.test(line)) {
          arr[index] = generateFlatImportLine(arr, index);
          removeNextLine = true;
        }

        if (removeNextLine) {
          arr.splice(index, 1);
          if (/;/.test(line)) { 
            removeNextLine = false; 
          }
        }
      });

      return arr;
    }

    function generateFlatImportLine(arr, fromIndex) {
      var lineArr = [];
      var lastIndex;
      
      arr.forEach(function(line, index) {
        if (index >= fromIndex && !lastIndex) {
          lineArr.push(line);
          if (/;/.test(line)) { 
            lastIndex = true; 
          }
        }
      });

      return lineArr.join('');
    }

  },

  importInBootstrap: function(entryPoint, packageName, packageData) {
    var providers = packageData.Provider;
    var directives = packageData.Directive;
    var pipes = packageData.Pipe;
    var all = [].concat(providers).concat(directives).concat(pipes);
    var contents = fs.readFileSync(entryPoint, 'utf8');
    var contentsArr = contents.split('\n');
    var lastIndex;
    var alreadyImported = false;
    var regExp = new RegExp(packageName, 'i');

    contentsArr.forEach(function(line, index) {
      if (regExp.test(line)) {
        alreadyImported = true;
      }
    });

    if (alreadyImported) {
      return false;
    }

    var imports = 'import {' + all.join(',') + '} from \'' + packageName + '\';';

    if (imports.length > 100) {
      imports = 'import {\n' + all.join('  ,\n') + '}\n from \'' + packageName + '\';';
    }

    contentsArr.forEach(function(line, index) {
      if (/import/.test(line)) {
        lastIndex = index;
      }
      else if (/bootstrap\(/.test(line) && providers && providers.length) {
        var replace;
        var replacement;

        if (/\)/.test(line)) {
          replace = line.match(/\((.*?)\)/)[0];
        } 
        else {
          replace = contentsArr.splice(index, contentsArr.length - 1).join('\n').replace(/\n/g, '');
          replace = replace.match(/\((.*?)\)/)[0];
        }

        var current = replace.replace(/\(/, '').replace(/\)/, '').replace(/ /g, '');
        var replacementProviders;

        if (/\[/.test(current)) {
          var currentProviders = current.match(/\[(.*?)\]/)[0];
          currentProviders = currentProviders.replace(/\[/, '').replace(/\]/, '').replace(/ /, '');
          currentProviders = currentProviders.split(',');
          replacementProviders = currentProviders.concat(providers);
          current = current.replace(/\,/, '').replace(/\[(.*?)\]/, '');

          replacement = 'bootstrap(' + current + ', [\n  ' + replacementProviders.join(', \n  ') + '\n]);';
          contentsArr[index] = replacement;
        }
        else {
          replacementProviders = providers;

          replacement = '(' + current + ', [\n  ' + replacementProviders.join(', \n  ') + '\n])';
          contentsArr[index] = contentsArr[index].replace(replace, replacement);
        }
      }
    });

    contentsArr.splice(lastIndex + 1, 0, imports);

    fs.writeFileSync(entryPoint, contentsArr.join('\n'), 'utf8');
    this.ui.writeLine(chalk.green('Package imported in', entryPoint));
  },

  injectItem: function(type, name, file) {
    var contents = fs.readFileSync(file, 'utf8');
    var contentsArr = contents.split('\n');
    var replace;
    var match;

    contentsArr.forEach(function(line, index) {
      var regExp = new RegExp(type);
      if (regExp.test(line)) {
        match = line.match(/\[(.*?)\]/)[0];
        replace = match;
        match = match.replace(/[\[\]]/g, '');
        match = match.split(',');
        match.push(name);
        match = match.filter(function(n) { return n !== ''; } ); 
        contentsArr[index] = contentsArr[index].replace(replace, '[' + match.join(',') + ']');
      }
    }.bind(this));

    fs.writeFileSync(file, contentsArr.join('\n'), 'utf8');
  },

  parseFile: function (packageName) {
    var packagePath = path.join(process.cwd(), 'node_modules', packageName, packageName + '.ts');
    
    if (!existsSync(packagePath)) {
      return false;
    }

    var contents = fs.readFileSync(packagePath, 'utf8');
    var data = {};
    
    data.Directive = [];
    data.Pipe = [];
    data.Provider = [];
    data.styleUrl = [];

    var contentsArr = contents.split('\n');
    contentsArr.forEach(function(line, index) {
      if (/directives:/.test(line)) {
        data.Directive = this.parseData(line);
      }
      else if (/pipes:/.test(line)) {
        data.Pipe = this.parseData(line);
      }
      else if (/providers:/.test(line)) {
        data.Provider = this.parseData(line);
      }
      else if (/styles:/.test(line)) {
        //data.styles = this.parseData(line);
      }
      else if (/styleUrls:/.test(line)) {
        data.styleUrl = this.parseData(line);
      }
    }.bind(this));

    _.each(data, function(val, key) {
      if (!data[key].length) {
        delete data[key];
      }
    });

    return data;
  },

  parseData: function (string) {
    var match = string.match(/\[(.*?)\]/)[0].replace(/\[/, '').replace(/\]/, '').replace(' ', '');
    return match.split(',');
  },

  checkIfPackageIsAuthentic: function (pkgName) {
    return true;

    if (!existsSync(path.join(nodeModules, pkgName))) {
      return false;
    }
    else {
      if (existsSync(path.join(nodeModules, pkgName, pkgName + '.ts')) &&
          existsSync(path.join(nodeModules, pkgName, 'bundles')) &&
          existsSync(path.join(nodeModules, pkgName, 'bundles', pkgName + '.js'))) {
        return true;
      }
      else {
        return false;
      }
    }
  },

  announceOKCompletion: function() {
    this.ui.writeLine('');
    this.completionOKMessage = 'Done.';
    this.ui.writeLine(chalk.green(this.completionOKMessage));
    this.done();
  },

  announceErrorCompletion: function() {
    this.ui.writeLine(chalk.red(this.completionErrorMessage));
    this.done();
  },

  done: function() {
    this.ui.stopProgress();
    this.restoreLogger();
  },

  disableLogger: function() {
    this.oldLog = console.log;
    console.log = function() {};
  },

  restoreLogger: function() {
    console.log = this.oldLog; // Hack, see above
  }

});
