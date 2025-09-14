'use strict';

var productionDeployment = require('./production');

module.exports = function defaultDeployment(getVersion) {
  var deployment = productionDeployment(getVersion);

  // The default deployment is what generates `index.html`. It previously referenced
  // locally built AngularJS artifacts, which are not available when the docs are
  // served from GitHub Pages. By basing the default deployment on the production
  // configuration we ensure the generated `index.html` uses CDN URLs and behaves
  // like `index-production.html`.
  deployment.name = 'default';

  return deployment;
};
