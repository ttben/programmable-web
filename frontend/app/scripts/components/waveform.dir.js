angular.module('waveform-directive', [])
  .directive("waveform", function () {
    return {
      restrict: "A",
      scope: {
        buffer: '='
      },
      link: function (scope, element) {
        var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        var width = element[0].width = element.parent().width();
        var height = element[0].height = element.parent().height();

        /**
         * draw the waveform (only once)
         */
        var draw = function () {
          var context = element[0].getContext('2d');
          width = element[0].width = element.parent().width();
          var data = scope.buffer.getChannelData(0);
          var step = Math.floor(data.length / width);
          var amp = height / 2;

          context.clearRect(0, 0, width, height);
          if (color)
            context.fillStyle = color;
          for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
              var datum = data[(i * step) + j];
              if (datum < min)
                min = datum;
              if (datum > max)
                max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
          }
        }

        scope.$watch(function () {
            return element.parent().width();
        }, function(){draw()}, true);
      }
    };
  });
