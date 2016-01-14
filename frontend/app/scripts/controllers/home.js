'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HomeCtrl',['$scope', 'Music', '$cookies', function ($scope, Music, $cookies) {
    if (typeof($cookies.token) !=='undefined') {
      $location.path('/');
    }
    $scope.songs=[];
    $scope.inError=false;
    Music.all(function(result) {
      console.log('got all songs !');
      $scope.songs=result;
    },
    function() {
      console.log('in error...');
      $scope.inError=true;
    });

  }]);
