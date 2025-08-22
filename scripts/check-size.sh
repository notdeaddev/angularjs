#!/bin/bash

npm run build:min
gzip -c < dist/angular.min.js > dist/angular.min.js.gzip
ls -l dist/angular.min.*
