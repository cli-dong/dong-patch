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

var chalk = require('chalk')
var shell = require('shelljs')
var getPkg = require('package')

module.exports = function(options) {
  var prefix = shell.exec('npm config get prefix', {
    silent: true
  }).output.trim()

  var nodeModules = path.join(prefix, 'node_modules', 'spm', 'node_modules')

  function updateAndInstall(dest) {
    var pkg

    try {
      pkg = getPkg(dest)
    } catch(e) {
      return console.error(chalk.red('`' + dest + '` 缺少 package.json 文件！'))
    }

    if (!options.force && pkg.dependencies.handlebars === '3.0.1') {
      return;
    }

    pkg.dependencies.handlebars = '3.0.1'

    fs.writeFileSync(path.join(dest, 'package.json'), JSON.stringify(pkg));

    var install = 'cd ' + dest + ' && npm install'

    if (dest.charAt(1) === ':') {
      install = dest.slice(0, 2) + ' && ' + install
    }

    console.log(chalk.magenta('░▒▓██ waiting……'))
    console.log('')

    shell.exec(install, {
      silent: true
    })
  }

  if (fs.existsSync(nodeModules)) {
    // serve-spm
    updateAndInstall(path.join(nodeModules, 'serve-spm'))
    // spm-build\node_modules\gulp-spm
    updateAndInstall(path.join(nodeModules, 'spm-build', 'node_modules', 'gulp-spm'))
  } else {
    console.error('请先执行 `$ npm install -g spm` 安装 SPM！')
  }

}
