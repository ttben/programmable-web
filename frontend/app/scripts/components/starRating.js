'use strict';

/**
 * Created by Garance on 31/01/2016.
 */
angular.module('star-directive', [])
.directive('starRating', function () {
  return {
    scope: {
      rating: '=',
      maxRating: '@',
      readOnly: '@',
      click: "&",
      mouseHover: "&",
      mouseLeave: "&"
    },
    restrict: 'EA',
    template:
      "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> "+
              "<img ng-src='{{((hoverValue + _rating) <= $index) && \"../../images/emptyStar.png\" || \"../../images/fillStar.png\"}}' "+
              "ng-Click='isolatedClick($index + 1)' "+
              "ng-mouseenter='isolatedMouseHover($index + 1)' "+
              "ng-mouseleave='isolatedMouseLeave($index + 1)'></img> "+
      "</div>",
    compile: function (element, attrs) {
      if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
        attrs.maxRating = '5';
      }
    },
    controller: function ($scope, $element, $attrs) {
      $scope.maxRatings = [];

      for (var i = 1; i <= $scope.maxRating; i++) {
        $scope.maxRatings.push({});
      }

      $scope._rating = $scope.rating;

      $scope.isolatedClick = function (param) {
        //$scope.rating = $scope._rating = param;
        $scope.hoverValue = 0;
        $scope.click({
          param: param
        });
      };

      $scope.isolatedMouseHover = function (param) {
        $scope._rating = 0;
        $scope.hoverValue = param;
        $scope.mouseHover({
          param: param
        });
      };

      $scope.isolatedMouseLeave = function (param) {
        $scope._rating = $scope.rating;
        $scope.hoverValue = 0;
        $scope.mouseLeave({
          param: param
        });
      };
    }
  };
});
