/*
 * dong-patch
 * https://github.com/crossjs/dong-patch
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
  command: 'patch',
  description: '给 SPM 打补丁',
  options: [{
    name: 'registry',
    alias: 'R',
    description: '自定义 NPM 源',
    optional: true,
    defaults: ''
  }, {
    name: 'force',
    alias: 'f',
    description: '强制重新打补丁',
    defaults: false
  }],
  bootstrap: require('./lib/patch'),
  help: function(chalk) {
    console.log('  Examples:')
    console.log('')
    console.log(chalk.gray('    $ ') +
                chalk.magenta('dong patch -R') +
                chalk.gray(' ....... equal to `dong patch -R https://registry.npm.taobao.org`'))
    console.log('')
  }
}
