'use strict';

var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
  sharedConfig(config, { testName: 'AngularJS: isolated module tests', logFile: 'karma-modules-isolated.log' });

  var moduleTests = angularFiles.mergeFilesFor(
    'karmaModules-ngAria',
    'karmaModules-ngCookies',
    'karmaModules-ngMessageFormat',
    'karmaModules-ngMessages',
    'karmaModules-ngResource',
    'karmaModules-ngRoute',
    'karmaModules-ngSanitize',
    'karmaModules-ngTouch'
  );

  config.set({
    files: [
      'build/angular.js',
      'build/angular-mocks.js',
      'test/modules/no_bootstrap.js',
      'test/helpers/matchers.js',
      'test/helpers/privateMocks.js',
      'test/helpers/support.js',
      'test/helpers/testabilityPatch.js'
    ].concat(moduleTests)
  });
};
