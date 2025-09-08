'use strict';

angular.
  module('test', []).
  config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }]).
  controller('TestController', function($anchorScroll, $location, $scope) {
    $scope.scrollTo = function(target) {
      // Set `$location.hash()` to `target` and
      // `$anchorScroll` will detect the change and scroll
      $location.hash(target);
    };
  });
