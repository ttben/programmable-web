/**
 * Created by Garance on 04/01/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('MusicPlayerCtrl', ["$scope", "$http", "$rootScope", '$cookies', function ($scope, $http, $rootScope, $cookies) {
    $scope.currentTrack = 0;
    $scope.pageSize = 5;
    $scope.data = [];

    //For each track, we set the uri where we can retrieve it
    $cookies.music.tracks.forEach(function (track) {
      track.uri = 'http://localhost:3001/' + $cookies.music.uri + '/' + track.uri;
    });


  }]);
