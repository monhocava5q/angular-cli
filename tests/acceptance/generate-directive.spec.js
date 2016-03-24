/*eslint-disable no-console */
'use strict';

var fs = require('fs-extra');
var ng = require('../helpers/ng');
var existsSync = require('exists-sync');
var expect = require('chai').expect;
var path = require('path');
var tmp = require('../helpers/tmp');
var root = process.cwd();
var conf = require('ember-cli/tests/helpers/conf');
var Promise = require('ember-cli/lib/ext/promise');

describe('Acceptance: ng generate directive', function () {
  before(conf.setup);

  after(conf.restore);

  beforeEach(function () {
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return ng(['new', 'foo', '--skip-npm', '--skip-bower']);
    });
  });

  afterEach(function () {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  it('ng generate directive my-comp', function () {
    return ng(['generate', 'directive', 'my-comp']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.ts');
      expect(existsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate directive test' + path.sep + 'my-comp', function () {
    return ng(['generate', 'directive', 'test' + path.sep + 'my-comp']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'test', 'my-comp', 'my-comp.ts');
      expect(existsSync(testPath)).to.equal(true);
    });
  });

  it('ng generate directive test' + path.sep + '..' + path.sep + 'my-comp', function () {
    return ng(['generate', 'directive', 'test' + path.sep + '..' + path.sep + 'my-comp'])
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.ts');
        expect(existsSync(testPath)).to.equal(true);
      });
  });

  it('ng generate directive my-comp from a child dir', () => {
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => fs.mkdirsSync('./1'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'directive', 'my-comp'])
      })
      .then(() => {
        var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.ts');
        expect(existsSync(testPath)).to.equal(true);
      }, err => console.log('ERR: ', err));
  });

  it('ng generate directive child-dir' + path.sep + 'my-comp from a child dir', () => {
    return new Promise(function (resolve) {
      process.chdir('./src');
      resolve();
    })
      .then(() => process.chdir('./app'))
      .then(() => fs.mkdirsSync('./1'))
      .then(() => process.chdir('./1'))
      .then(() => {
        process.env.CWD = process.cwd();
        return ng(['generate', 'directive', 'child-dir' + path.sep + 'my-comp'])
      })
      .then(() => {
        var testPath = path.join(
          root, 'tmp', 'foo', 'src', 'app', '1', 'child-dir', 'my-comp', 'my-comp.ts');
        expect(existsSync(testPath)).to.equal(true);
      }, err => console.log('ERR: ', err));
  });

  it('ng generate directive child-dir' + path.sep + '..' + path.sep + 'my-comp from a child dir',
    () => {
      return new Promise(function (resolve) {
        process.chdir('./src');
        resolve();
      })
        .then(() => process.chdir('./app'))
        .then(() => fs.mkdirsSync('./1'))
        .then(() => process.chdir('./1'))
        .then(() => {
          process.env.CWD = process.cwd();
          return ng(
            ['generate', 'directive', 'child-dir' + path.sep + '..' + path.sep + 'my-comp'])
        })
        .then(() => {
          var testPath =
            path.join(root, 'tmp', 'foo', 'src', 'app', '1', 'my-comp', 'my-comp.ts');
          expect(existsSync(testPath)).to.equal(true);
        }, err => console.log('ERR: ', err));
    });

  it('ng generate directive ' + path.sep + 'my-comp from a child dir, gens under ' +
    path.join('src', 'app'),
    () => {
      return new Promise(function (resolve) {
        process.chdir('./src');
        resolve();
      })
        .then(() => process.chdir('./app'))
        .then(() => fs.mkdirsSync('./1'))
        .then(() => process.chdir('./1'))
        .then(() => {
          process.env.CWD = process.cwd();
          return ng(['generate', 'directive', path.sep + 'my-comp'])
        })
        .then(() => {
          var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', 'my-comp', 'my-comp.ts');
          expect(existsSync(testPath)).to.equal(true);
        }, err => console.log('ERR: ', err));
    });

  it('ng generate directive ..' + path.sep + 'my-comp from root dir will fail', () => {
    return ng(['generate', 'directive', '..' + path.sep + 'my-comp']).then(() => {
      var testPath = path.join(root, 'tmp', 'foo', 'src', 'app', '..', 'my-comp', 'my-comp.ts');
      expect(existsSync(testPath)).to.equal(false);
    });
  });
});
