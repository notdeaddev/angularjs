'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const files = require('../angularFiles').files;

const combinedFiles = _.clone(files.angularModules);
combinedFiles.ng = files.angularSrc;
combinedFiles.angularLoader = files.angularLoader;

let errorsDetected = false;
const directories = [];
const detectedFiles = {};

for (const section in combinedFiles) {
  const sectionFiles = combinedFiles[section];
  if (section !== 'angularLoader') {
    directories.push('src/' + section);
  }
  sectionFiles.forEach((file) => {
    detectedFiles[file] = true;
    if (!fs.existsSync(file)) {
      console.error(file + ' does not exist in the local file structure.');
      errorsDetected = true;
    }
  });
}

directories.forEach((directory) => {
  glob.sync(directory + '/**/*').forEach((filePath) => {
    if (!fs.lstatSync(filePath).isDirectory()) {
      const fileName = path.basename(filePath);
      const isHiddenFile = fileName[0] === '.';
      if (!isHiddenFile && !detectedFiles[filePath]) {
        console.error(filePath + ' exists in the local file structure but isn\'t used by any module.');
        errorsDetected = true;
      }
    }
  });
});

if (errorsDetected) {
  console.error('Not all files were properly detected in the local file structure.');
  process.exit(1);
} else {
  console.log('All files were detected successfully!');
}
