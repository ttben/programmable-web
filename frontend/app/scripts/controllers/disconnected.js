/**
 * Created by Garance on 14/01/2016.
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
  .controller('DisconnectedCtrl',['$scope', '$location', '$cookies', function ($scope, $location, $cookies) {
    if ($cookies.token) {
      $location.path('/home');
    }

  }]);
