'use strict';

var path = require('canonical-path');

/**
 * @dgService minErrInfo
 * @description
 * Load the error information that was generated during the AngularJS build.
 */
module.exports = function getMinerrInfo(readFilesProcessor, log) {
  return function() {
    var minerrInfoPath = path.resolve(readFilesProcessor.basePath, 'build/errors.json');
    try {
      return require(minerrInfoPath);
    } catch (e) {
      log.warn('No errors.json found at ' + minerrInfoPath + '; skipping minErr info');
      return {errors: {}};
    }
  };
};
