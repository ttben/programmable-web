/**
 * Created by Garance on 04/01/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MusicPlayerCtrl
 * @description this controller launches the audioplayer directive, which contains all the tracks and everything.
 * # MusicPlayerCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('MusicPlayerCtrl', ["$scope", '$cookies', 'CONSTANTS', function ($scope, $cookies, CONSTANTS) {
    $scope.currentTrack = 0;
    $scope.pageSize = 5;
    $scope.data = [];
    $scope.inError = false;

    //For each track, we set the uri where we can retrieve it
    if (typeof($cookies.music) !== 'undefined') {
      $cookies.music.tracks.forEach(function (track) {
        track.uri = CONSTANTS.backendUrl + $cookies.music.uri + '/' + track.uri;
      });
    }
    else {
      $scope.inError = true;
    }

  }]);
