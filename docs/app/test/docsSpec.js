'use strict';

describe('DocsController', function() {
  var $scope, $anchorScroll;

  angular.module('fake', [])
    .value('$cookies', {})
    .value('NG_PAGES', {})
    .value('NG_NAVIGATION', {});

  angular.module('currentVersionData', [])
    .value('CURRENT_NG_VERSION', {});

  angular.module('allVersionsData', [])
    .value('ALL_NG_VERSIONS', {});

  beforeEach(module('fake', 'DocsController', function($provide) {
    $anchorScroll = jasmine.createSpy('$anchorScroll');
    $provide.value('$anchorScroll', $anchorScroll);
  }));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    $controller('DocsController', { $scope: $scope });
  }));


  describe('afterPartialLoaded', function() {
    it('should update the Google Analytics with currentPage path if currentPage exists', inject(function($window) {
      $window._gaq = [];
      $scope.currentPage = { path: 'a/b/c' };
      $scope.$broadcast('$includeContentLoaded');
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'a/b/c']);
    }));


    it('should update the Google Analytics with $location.path if currentPage is missing', inject(function($window, $location) {
      $window._gaq = [];
      spyOn($location, 'path').and.returnValue('x/y/z');
      $scope.$broadcast('$includeContentLoaded');
      expect($window._gaq.pop()).toEqual(['_trackPageview', 'x/y/z']);
    }));

    it('should scroll to the anchor', function() {
      $scope.$broadcast('$includeContentLoaded');
      expect($anchorScroll).toHaveBeenCalled();
    });
  });

  it('should hide the loading indicator after content is loaded', inject(function($compile) {
    var element = $compile('<div ng-show="loading">Loading &hellip;</div>')($scope);
    $scope.loading = true;
    $scope.$digest();
    expect(element.hasClass('ng-hide')).toBe(false);

    $scope.$broadcast('$includeContentLoaded');
    $scope.$digest();
    expect(element.hasClass('ng-hide')).toBe(true);
  }));
});
