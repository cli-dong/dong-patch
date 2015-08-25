/*
 * dong-patch
 * https://github.com/crossjs/dong-patch
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs')
var path = require('path')

var getPkg = require('package')
var log = require('spm-log')
var shell = require('shelljs')

module.exports = function(options) {
  var dest = path.join(__dirname,
    '..', '..', 'dong-build',
    'node_modules', 'nd-sea',
    'node_modules', 'gulp-spm')

  log.info('patch', 'patching destination is', dest)

  function doPatch(dest) {
    var pkg

    try {
      pkg = getPkg(dest)
    } catch(e) {
      return log.error('patch', 'there is no `package.json` in `' + dest + '`')
    }

    if (!options.force && pkg.dependencies.handlebars === '3.0.1') {
      log.warn('patch', 'already patched! patching skipped')
      return;
    }

    var install = 'npm install handlebars@3.0.1 --save --save-exact'

    if (options.sudo && process.platform !== 'win32') {
      install = 'sudo ' + install
    }

    if (options.registry) {
      if (options.registry === true) {
        options.registry = 'https://registry.npm.taobao.org'
      }

      install += ' --registry ' + options.registry
    }

    install = ['cd ' + dest, install]

    if (process.platform === 'win32' && dest.charAt(1) === ':') {
      install.unshift(dest.slice(0, 2))
    }

    log.info('patch', 'patching ...')

    shell.exec(install.join(' && '), {
      silent: false
    })

    log.info('patch', 'done! patched successfully')
  }

  if (fs.existsSync(dest)) {
    doPatch(dest)
  } else {
    log.error('patch', 'please run `npm install -g dong` first')
  }
}
