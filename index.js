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

  var dest = path.join(prefix,
    'node_modules', 'dong',
    'node_modules', 'dong-build',
    'node_modules', 'spm-sea',
    'node_modules', 'gulp-spm')

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

    pkg.dependencies.handlebars = '3.0.1'

    fs.writeFileSync(path.join(dest, 'package.json'), JSON.stringify(pkg, null, 2));

    var install = 'cd ' + dest + ' && npm install'

    if (dest.charAt(1) === ':') {
      install = dest.slice(0, 2) + ' && ' + install
    }

    shell.exec(install, {
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
