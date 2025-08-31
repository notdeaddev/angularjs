'use strict';

var e2eServer;

exports.config = {
  allScriptsTimeout: 11000,

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine2',

  capabilities: {
    // Fix element scrolling behavior in Firefox for fixed header elements (like angularjs.org has)
    'elementScrollBehavior': 1
  },

  beforeLaunch: function() {
    var createServer = require('./test/e2e/server');
    e2eServer = createServer();
    return new Promise(function(resolve) {
      e2eServer.listen(8000, resolve);
    });
  },

  afterLaunch: function() {
    if (e2eServer) {
      e2eServer.close();
    }
  },

  onPrepare: function() {
    /* global angular: false, browser: false, jasmine: false */

    // Store the name of the browser that's currently being used.
    browser.getCapabilities().then(function(caps) {
      browser.params.browser = caps.get('browserName');
    });
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
    showTiming: true
  }
};
