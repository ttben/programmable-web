'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('HeaderCtrl', ['$scope', '$cookies', 'User', '$location', '$rootScope', function ($scope, $cookies, User, $location, $rootScope) {
      if (typeof($cookies.get('token')) !== 'undefined') {
        $location.path('/home');
      } else {
        $location.path('/disconnected');
      }

    $scope.login = function (user) {
      User.authenticate(user.usernameOrEmail, user.password, function () {
          $rootScope.header = "default";
          $location.path('/home');
        },
        function () {
          $location.path('/disconnected');
          console.log('error... :(');
        });
    };

    $scope.signUp = function(user) {
      User.signUp(user.usernameOrEmail, user.password, function() {
          $rootScope.header = "default";
          $location.path('/home');
        },
        function() {
          $location.path('/disconnected');
          console.log('error... :(');
        });
    };

    $scope.logout = function() {
      $cookies.put('token', '');
      $rootScope.header = "home";
      $location.path('/disconnected');
    };
  }]);
