'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:HeaderCtrl
 * @description this controller is specifically for the header: is allows the user to disconnect. It also checks the user's token to redirect to the right header.
 * # HeaderCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HeaderCtrl', ['$location', '$rootScope', '$cookies', function ($location, $rootScope, $cookies) {

      if (typeof($cookies.get('token')) !== 'undefined') {
        $location.path('/home');
      } else {
        $location.path('/disconnected');
      }


    $scope.logout = function() {
      $cookies.remove('token');
      $cookies.remove('userName');
      $rootScope.header = "home";
      $location.path('/disconnected');
    };
  }]);
