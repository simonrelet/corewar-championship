'use strict';

const VERSION = require('../package.json').version;

module.exports = {
  createViewData: function (data) {
    return Object.assign(data, {
      version: VERSION
    });
  }
};
