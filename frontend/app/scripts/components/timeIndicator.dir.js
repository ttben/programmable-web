angular.module('time-indicator-directive', [])
  .directive("timeIndicator", function () {
    return {
      restrict: "A",
      scope: {
        currentTime: '=', // the TRUE currentTime
        totalTime: '=', // the duration of the track
        timeChanged: '&' // the function to call on time update
      },
      link: function (scope, element) {
        var context = element[0].getContext('2d');
        var width = element[0].width;
        var height = element[0].height;
        var isMouseDown = false;

        /**
         * redraws the rectangle when the timer is updated
         */
        scope.$watch(function () {
            return scope.currentTime;
          },
          function (newValue) {
            context.clearRect(0, 0, width, height);
            var boxWidth = width * newValue / scope.totalTime;
            context.fillStyle = "rgba(255,255,255,0.50)";
            context.fillRect(0, 0, boxWidth, height);
          }, true
        );

        /**
         * listens to the mouse down event
         */
        element.bind('mousedown', function (event) {
          isMouseDown = true;
          var x;
          if (event.offsetX !== undefined) {
            x = event.offsetX;
          } else {
            x = event.layerX - event.currentTarget.offsetLeft;
          }
          scope.timeChanged({timeSelected: x / width * scope.totalTime});
        });

        /**
         * listens to the mouse move and checks if the mouse button is down
         */
        element.bind('mousemove', function (event) {
          var x;
          if (event.offsetX !== undefined) {
            x = event.offsetX;
          } else {
            x = event.layerX - event.currentTarget.offsetLeft;
          }
          if (isMouseDown) {
            scope.timeChanged({timeSelected: x / width * scope.totalTime});
          }
        });

        // the mouse button is not down anymore when it left the canvas or when it's up (obviously...)
        element.bind('mouseup', function (event) {
          isMouseDown = false;
        });
        element.bind('mouseleave', function (event) {
          isMouseDown = false;
        });
      }
    };
  });