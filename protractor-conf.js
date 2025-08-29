'use strict';

var config = require('./protractor-shared-conf').config;

config.specs = [
  'test/e2e/tests/**/*.js',
  'build/docs/ptore2e/**/*.js',
  'docs/app/e2e/**/*.scenario.js'
];

config.capabilities.browserName = 'chrome';
config.capabilities.chromeOptions = {
  args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
};

config.directConnect = true;
config.chromeDriver = process.env.CHROMEDRIVER_PATH || '/usr/local/bin/chromedriver';

exports.config = config;
