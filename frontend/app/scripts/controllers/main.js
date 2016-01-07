'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('MainCtrl',['$scope', 'Music', function ($scope, Music) {
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
