/**
 * Created by Garance on 04/01/2016.
 */
angular.module('audioPlayer-directive', [])
  .directive('audioPlayer', function ($rootScope, $http) {
    return {
      restrict: 'E',
      scope: {},
      controller: function ($scope) {
        $scope.globalVolume = 1;
        $scope.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // set track & play it
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
                $scope.audioContext.decodeAudioData(data, function (buffer) {
                  var track = {"name": $scope.info.tracks[i], "volume": 1};
                  track.source = $scope.audioContext.createBufferSource();
                  track.source.buffer = buffer;
                  var gainNode = $scope.audioContext.createGain();
                  track.gain = gainNode.gain;
                  track.source.connect(gainNode);
                  gainNode.connect($scope.audioContext.destination);
                  $scope.tracks.push(track);
                  $scope.start();
                  //$scope.displayBuffer(buffer);
                });
              }
            })(i));
          }

          $scope.start = function () {
            if ($scope.tracks.length == $scope.info.tracks.length) {
              $scope.tracksLoaded = true;

              for (var i = 0; i < $scope.tracks.length; i++) {
                $scope.tracks[i].source.start();
              }
              $scope.playing = true;
            }
          }

          // tell audio elements to play/pause, you can also use $scope.audio.play() or $scope.audio.pause();
          $scope.playpause = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.playing ? $scope.audioContext.suspend() : $scope.audioContext.resume();
            }
            $scope.playing = !$scope.playing;
          };

          // tell audio elements the volume has changed
          // TODO : change the volume of one single element instead of all elements in some cases
          $scope.volumeChanged = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].gain.value = $scope.tracks[i].volume * $scope.globalVolume;
            }
          };

          // tell audio elements the time has changed
          $scope.timeChanged = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].audio.currentTime = $scope.tracks[0].audio.currentTime;
            }
          };
        });

        // update display of things - makes time-scrub work
        setInterval(function () {
          $scope.$apply();
        }, 500);
      },

      templateUrl: '/scripts/components/audioplayer.html'
    };
  });
