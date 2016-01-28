'use strict';
angular.module('audioPlayer-directive', [])
  .directive('audioPlayer', ['$rootScope', '$http', '$cookies', 'Music', 'Comment', function ($rootScope, $http, $cookies, Music, Comment) {
    return {
      restrict: 'E',
      scope: {},
      controller: function ($scope) {

        //Function to save a new mix in the database. Should add params as name
        $scope.saveMyMix = function () {
          var newMix = [];
          $scope.tracks.forEach(function (track) {
            newMix.push({
              panValue: track.panNode.pan.value,
              trebleValue: track.trebleFilter.gain.value,
              bassValue: track.bassFilter.gain.value,
              muted: track.muted,
              volume: track.volume,
              name: track.name
            });
          });
          Music.createMix($scope.info._id, $scope.mixName, newMix, function () {
            console.log('managed to create the mix !');
            $scope.saveDrawerOpened = false;
            Music.get($scope.info._id, function (musicReloaded) {
              $scope.info.mixes = musicReloaded.data.mixes;
            }, function () {
              console.log('error :(');
            });
          }, function (error) {
            console.log(error);
          });
        };
        $scope.commentToAdd = '';
        $scope.addComment = function () {
          console.log('You want to add a comment to the mix ', $scope.loadedMix._id);
          //  commentToAdd
          Comment.newC($scope.loadedMix._id, $scope.commentToAdd, function () {
            console.log('managed to add the comment');
            $scope.commentToAdd = '';
          }, function (error) {
            console.log(error);
          });
        };

        //Function to load an existing mix instead of the current settings
        $scope.loadAMix = function (theMix) {
          $scope.aMixIsLoaded = true;
          $scope.loadedMix = theMix;
          $scope.tracks.forEach(function (track) {
            theMix.tracks.forEach(function (mixTrack) {
              if (track.name === mixTrack.name) {
                track.panNode.pan.value = mixTrack.panValue;
                track.trebleFilter.gain.value = mixTrack.trebleValue;
                track.bassFilter.gain.value = mixTrack.bassValue;
                track.muted = mixTrack.muted;
                track.volume = mixTrack.volume;
              }
            });
          });

        };
        $scope.globalVolume = 1; //the global gain
        $scope.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // the audio context (with browser compatibility)
        $scope.audioContext.suspend(); // immediately suspend the context (or the currentTime will start incrementing)
        $scope.currentTime = 0; // TRUE currentTime (the audioContext currentTime is not settable so... we need our own timer)
        $scope.offset = 0; // = audioContext.currentTime - currentTime

        $scope.info = $cookies.music;
        $scope.tracks = [];
        for (var i = 0; i < $scope.info.tracks.length; i++) {
          $http({
            method: 'GET',
            url: $scope.info.tracks[i].uri,
            responseType: "arraybuffer"
          }).success((function (i) {
            return function (data) {
              // on success : get the track buffer and keep the nodes in memory
              $scope.audioContext.decodeAudioData(data, function (buffer) {
                var track = {"name": $scope.info.tracks[i].name, "volume": 1};
                track.source = $scope.audioContext.createBufferSource();
                track.source.buffer = buffer;
                track.gainNode = $scope.audioContext.createGain();
                track.trebleFilter = $scope.audioContext.createBiquadFilter();
                track.trebleFilter.type = "highshelf";
                track.trebleFilter.frequency.value = 2000;
                track.bassFilter = $scope.audioContext.createBiquadFilter();
                track.bassFilter.type = "lowshelf";
                track.bassFilter.frequency.value = 200;
                track.panNode = $scope.audioContext.createStereoPanner();

                track.source.connect(track.gainNode);
                track.gainNode.connect(track.trebleFilter);
                track.trebleFilter.connect(track.bassFilter);
                track.bassFilter.connect(track.panNode);
                track.panNode.connect($scope.audioContext.destination);

                track.analyser = $scope.audioContext.createAnalyser();
                track.analyser.smoothingTimeConstant = 0.3;
                track.analyser.fftSize = 1024;
                track.gainNode.connect(track.analyser);

                $scope.tracks.push(track);
                $scope.start();
              });
            };
          })(i));
        }

        /**
         * checks if all the tracks are loaded : start the tracks if so
         */
        $scope.start = function () {
          if ($scope.tracks.length === $scope.info.tracks.length) {
            $scope.tracksLoaded = true;

            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].source.start();
            }
          }
        };

        var addAnalyser = function (nodeSource) {
        };

        /**
         * checks if all the tracks are loaded : start the tracks if so
         */
        $scope.start = function () {
          if ($scope.tracks.length === $scope.info.tracks.length) {
            $scope.tracksLoaded = true;

            for (var i = 0; i < $scope.tracks.length; i++) {
              $scope.tracks[i].source.start();
            }
          }
        };

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
         */
        $scope.volumeChanged = function (track) {
          if (track && !track.muted) {
            track.gainNode.gain.value = track.volume * $scope.globalVolume;
            return;
          }
          for (var i = 0; i < $scope.tracks.length; i++) {
            if ($scope.tracks[i].muted) {
              $scope.tracks[i].gainNode.gain.value = 0;
            } else {
              $scope.tracks[i].gainNode.gain.value = $scope.tracks[i].volume * $scope.globalVolume;
            }
          }
        };

        $scope.mute = function (track) {
          track.muted = !track.muted;
          $scope.volumeChanged();
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
            $scope.tracks[i].source.connect($scope.tracks[i].analyser);
            $scope.currentTime = timeSelected;
            $scope.offset = $scope.audioContext.currentTime - $scope.currentTime;
          }
        };

        /**
         * called when the user wants to listen one single track
         * @param track
         */
        $scope.silenceAskedFrom = function (track) {
          var silence = false;
          if (!track.muted) {
            for (var i = 0; i < $scope.tracks.length; i++) {
              if ($scope.tracks[i] != track && !$scope.tracks[i].muted) {
                silence = true;
                break;
              }
            }
          } else {
            silence = true;
          }
          track.muted = false;
          for (var i = 0; i < $scope.tracks.length; i++) {
            if ($scope.tracks[i] === track)continue;
            $scope.tracks[i].muted = silence;
          }
          $scope.volumeChanged();
        };

        /**
         * Draws a spectrum
         */
        var drawSpectrum = function (ctx, array) {
          for (var i = 0; i < (array.length); i++) {
            var value = array[i];
            ctx.fillRect(i * 4, 1080 - value * 3, 3, 1080);
          }
        };

        /**
         * update our currentTime when the audioContext.currentTime is updated
         */
        $scope.$watch(function () {
          return $scope.audioContext.currentTime;
        }, function () {
          $scope.currentTime = $scope.audioContext.currentTime - $scope.offset;

          if (!$scope.tracksLoaded)return;
          var arrays = [];
          for (var i = 0; i < $scope.tracks.length; i++) {
            var array = new Uint8Array($scope.tracks[i].analyser.frequencyBinCount);
            $scope.tracks[i].analyser.getByteFrequencyData(array);
            arrays.push(array);
          }
          var finalArray = [];

          for (var j = 0; j < arrays[0].length; j++) {
            var average = 0;
            for (var i = 0; i < arrays.length; i++) {
              average += arrays[i][j];
            }
            finalArray.push(average/arrays.length);
          }

          var element = angular.element(document.querySelector('#canvas'));
          var ctx = element[0].getContext('2d');
          // clear the current state
          ctx.clearRect(0, 0, element.width(), element.height());

          // set the fill style
          ctx.fillStyle = "white";

          drawSpectrum(ctx, finalArray);
        });

        $scope.$on("$destroy", function () {
          $scope.audioContext.close();
          $scope.audioContext = undefined;
          $scope.tracks = [];
        });

        // update display of things - makes time-scrub work
        setInterval(function () {
          $scope.$apply();
        }, 100); // If your computer is burning as hell, it may be because of this
      },

      templateUrl: '/scripts/components/audioplayer.html'
    };
  }]);
