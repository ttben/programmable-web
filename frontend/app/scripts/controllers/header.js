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
      }

    $scope.login = function (user) {
      User.authenticate(user.usernameOrEmail, user.password, function (token) {
          $rootScope.header = "default";
          $location.path('/home');
        },
        function (error) {
          console.log('error... :(');
        })
    };

    $scope.signUp = function(user) {
      User.signUp(user.usernameOrEmail, user.password, function(token) {
          $rootScope.header = "default";
          $location.path('/home');
        },
        function(error) {
          console.log('error... :(');
        })
    };

    $scope.logout = function() {

      $rootScope.header = "home";
      $location.path('/');
    }
  }]);
