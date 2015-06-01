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
  var prefix = shell.exec('npm config get prefix', {
    silent: true
  }).output.trim()

  if (!prefix) {
    return log.error('patch', '请通过 `npm config set prefix` 正确设置 npm 目录')
  }

  log.info('patch', 'prefix is', prefix)

  var dest = path.join(__dirname,
    '..', '..', 'dong-build',
    'node_modules', 'spm-sea',
    'node_modules', 'gulp-spm')

  log.info('patch', 'destination is', dest)

  var npmInstall = 'npm install handlebars@3.0.1 --save --save-exact'

  if (options.registry) {
    if (options.registry === true) {
      options.registry = 'https://registry.npm.taobao.org'
    }

    npmInstall += ' --registry' + options.registry
  }

  function updateAndInstall(dest) {
    var pkg

    try {
      pkg = getPkg(dest)
    } catch(e) {
      return log.error('patch', '`' + dest + '` 缺少 package.json 文件！')
    }

    log.info('patch', dest)

    if (!options.force && pkg.dependencies.handlebars === '3.0.1') {
      log.info('patch', 'already patched! skip now.')
      return;
    }

    var install = ['cd ' + dest, npmInstall]

    if (dest.charAt(1) === ':') {
      install.unshift(dest.slice(0, 2))
    }

    shell.exec(install.join(' && '), {
      silent: false
    })

    log.info('patch', 'done!')
  }

  if (fs.existsSync(dest)) {
    updateAndInstall(dest)
  } else {
    log.error('patch', '请执行 `$ npm install -g dong` 更新 DONG！')
  }
}
