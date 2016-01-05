/**
 * Created by Garance on 04/01/2016.
 */
angular.module('audioPlayer-directive', [])
  .directive('audioPlayer', function ($rootScope) {
    return {
      restrict: 'E',
      scope: {},
      controller: function ($scope, $element) {
        $scope.globalVolume = 1;

        // set track & play it
        $rootScope.$on('audio.set', function (r, folder, info) {
          $scope.info = info;
          $scope.tracks = [];
          for (var i = 0; i < info.tracks.length; i++) {
            var track = {"audio": new Audio(), "name": info.tracks[i], "volume":1};
            $scope.tracks.push(track);
            $scope.tracks[i].audio.src = folder + info.tracks[i] + ".mp3";

            // listen for audio-element events, and broadcast stuff
            $scope.tracks[i].audio.addEventListener('play', function () {
              $rootScope.$broadcast('audio.play', this);
            });
            $scope.tracks[i].audio.addEventListener('pause', function () {
              $rootScope.$broadcast('audio.pause', this);
            });
            $scope.tracks[i].audio.addEventListener('timeupdate', function () {
              $rootScope.$broadcast('audio.time', this);
            });
            $scope.tracks[i].audio.addEventListener('ended', function () {
              $rootScope.$broadcast('audio.ended', this);
              console.log("ended");
            });
          }

          // tell audio elements to play/pause, you can also use $scope.audio.play() or $scope.audio.pause();
          $scope.playpause = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              var a = $scope.tracks[i].audio.paused ? $scope.tracks[i].audio.play() : $scope.tracks[i].audio.pause();
            }
          };

          // tell audio elements the volume has changed
          // TODO : change the volume of one single element instead of all elements in some cases
          $scope.volumeChanged = function () {
            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].audio.volume = $scope.tracks[i].volume*$scope.globalVolume;
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
