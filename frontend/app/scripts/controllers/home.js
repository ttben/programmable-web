'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HomeCtrl',['$scope', 'Music', '$cookies', '$http', '$location', function ($scope, Music, $cookies, $location) {
    /*if (typeof($cookies.token) == 'undefined') {
      $location.path('/');
    }*/
    $scope.songs=[];
    $scope.inError=false;
    Music.all(function(result) {
      console.log('got all songs !');
      console.log(result);
      $scope.songs=result;
        $('#loader').hide();
        $('#musicList').show();
    },
    function() {
      console.log('in error...');
      $scope.inError=true;
    });

  $scope.getSpecificSong = function(songName) {
    console.log('you want to listen to song with id ', songName);
    Music.get(songName, function(successAnswer) {
      console.log('got all the song\'s details !');
      console.log(successAnswer);
    }, function(error) {
      console.log('in error :((');
    });
  };
    // default view is cards
    $scope.mode = 2;






  }]);
