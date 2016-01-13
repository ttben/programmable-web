angular.module('audioPlayer-directive', [])
  .directive('audioPlayer', function ($rootScope, $http) {
    return {
      restrict: 'E',
      scope: {},
      controller: function ($scope) {
        $scope.globalVolume = 1; //the global gain
        $scope.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // the audio context (with browser compatibility)
        $scope.audioContext.suspend(); // immediately suspend the context (or the currentTime will start incrementing)
        $scope.currentTime = 0; // TRUE currentTime (the audioContext currentTime is not settable so... we need our own timer)
        $scope.offset = 0; // = audioContext.currentTime - currentTime

        /**
         * called when a multi-track is set
         */
        $rootScope.$on('audio.set', function (r, folder, info) {
          $scope.info = info;
          $scope.tracks = [];
          for (var i = 0; i < info.tracks.length; i++) {
            $http({
              method: 'GET',
              url: folder + info.tracks[i] + ".mp3",
              responseType: "arraybuffer"
            }).success((function (i) {
              return function (data) {
                // on success : get the track buffer and keep the nodes in memory
                $scope.audioContext.decodeAudioData(data, function (buffer) {
                  var track = {"name": $scope.info.tracks[i], "volume": 1};
                  track.source = $scope.audioContext.createBufferSource();
                  track.source.buffer = buffer;
                  var gainNode = $scope.audioContext.createGain();
                  track.gainNode = gainNode;
                  track.source.connect(gainNode);
                  gainNode.connect($scope.audioContext.destination);
                  $scope.tracks.push(track);
                  $scope.start();
                });
              }
            })(i));
          }

          /**
           * checks if all the tracks are loaded : start the tracks if so
           */
          $scope.start = function () {
            if ($scope.tracks.length == $scope.info.tracks.length) {
              $scope.tracksLoaded = true;

              for (var i = 0; i < $scope.tracks.length; i++) {
                $scope.tracks[i].source.start();
              }
            }
          }

          /**
           * tells audio elements to play/pause
           */
          $scope.playpause = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.playing ? $scope.audioContext.suspend() : $scope.audioContext.resume();
            }
            $scope.playing = !$scope.playing;
          };

          /**
           * called when the global volume or one of the tracks volumes is changed
           * not a great idea to browse all the tracks but... it works !
           * TODO : change the volume of only one track
           */
          $scope.volumeChanged = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].gainNode.gain.value = $scope.tracks[i].volume * $scope.globalVolume;
            }
          };

          /**
           * called when the user "travels through time"
           * @param timeSelected
           */
          $scope.timeChanged = function (timeSelected) {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].source.stop();
              var buffer = $scope.tracks[i].source.buffer;
              $scope.tracks[i].source = $scope.audioContext.createBufferSource();
              $scope.tracks[i].source.buffer = buffer;
              $scope.tracks[i].source.connect($scope.tracks[i].gainNode);
              $scope.tracks[i].source.start(0, timeSelected);
              $scope.currentTime = timeSelected;
              $scope.offset = $scope.audioContext.currentTime - $scope.currentTime;
            }
          }

          /**
           * update our currentTime when the audioContext.currentTime is updated
           */
          $scope.$watch(function () {
            return $scope.audioContext.currentTime;
          }, function () {
            $scope.currentTime = $scope.audioContext.currentTime - $scope.offset;
          })
        });

        // update display of things - makes time-scrub work
        setInterval(function () {
          $scope.$apply();
        }, 100); // If your computer is burning as hell, it may be because of this
      },

      templateUrl: '/scripts/components/audioplayer.html'
    };
  });
