'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HomeCtrl',['$scope', 'Music', '$cookies', '$http', function ($scope, Music, $cookies, $http) {
    if (typeof($cookies.token) !=='undefined') {
      $location.path('/');
    }
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
    console.log('you want to listen to', songName);
  };


    /*$scope.showUserModal = function(idx){
      var user = $scope.users[idx].user;
      $scope.currUser = user;
      $('#myModalLabel').text(user.name.first
        + ' ' + user.name.last);
      $('#myModal').modal('show');
    };
    */

    // default view is cards
    $scope.mode = 2;






  }]);
