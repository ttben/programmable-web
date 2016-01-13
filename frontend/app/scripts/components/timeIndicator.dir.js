/**
 * Created by Hugo on 13/01/2016.
 */
angular.module('time-indicator-directive', [])
  .directive("timeIndicator", function () {
    return {
      restrict: "A",
      scope: {
        currentTime: '=',
        totalTime: '='
      },
      link: function (scope, element) {
        var context = element[0].getContext('2d');
        var width = element[0].width;
        var height = element[0].height;

        scope.$watch(function () {
            return scope.currentTime;
          },
          function (newValue) {
            context.clearRect(0, 0, width, height);
            var boxWidth = width * newValue / scope.totalTime;
            context.fillStyle = "rgba(255,255,255,0.33)";
            context.fillRect(0, 0, boxWidth, height);
          }, true
        );
      }
    };
  });
