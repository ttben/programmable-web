'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HomeCtrl',['$scope', 'Music', '$cookies', '$location', 'CONSTANTS', function ($scope, Music, $cookies, $location, CONSTANTS) {
    //This cookie will store the song the user wants to play - We reset it when you get on the music list
    $cookies.remove('song');

    $scope.songs=[];
    //This boolean allows us to deal with server errors for the user
    $scope.inError=false;

    //We get the list of all the musics stored on the server
    Music.all(function(result) {
      $scope.songs=result;
        $scope.songs.forEach(function(song) {
          var imgURI = song.image;
          //TODO: use CONSTANTS, BUT got undefined when I tried.. :(
          song.image = CONSTANTS.backendUrl + imgURI;
        });
    },
    function() {
      console.log('in error...');
      $scope.inError=true;
    });

    //When we click on a specific song, we get all its specific data, and move on to the next page
  $scope.getSpecificSong = function(songName) {
    Music.get(songName, function(successAnswer) {
      $cookies.music = successAnswer.data;
      $cookies.music.image = CONSTANTS.backendUrl + $cookies.music.image;
      $location.url('/musicPlayer');
    }, function() {
      $scope.inError=true;
      console.log('in error :((');
    });
  };
    // default view is cards
    $scope.mode = 2;


  }]);
