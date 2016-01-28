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
  .controller('DisconnectedCtrl', ['$scope', '$location', '$cookies', 'User', '$rootScope', function ($scope, $location, $cookies, User, $rootScope) {

    if ($cookies.token) {
      $location.path('/home');
    }
    $scope.connexionAsked = false;
    $scope.roleDrawerOpened = false;

    //This is the roles list, you can pick one at signup
    $scope.rolesList = ["public", "user", "admin"];

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

    $scope.signUp = function (user) {
      $scope.roleDrawerOpened = false;
      User.signUp(user.usernameOrEmail, user.password, user.role, function () {
          $rootScope.header = "default";
          $location.path('/home');
        },
        function (data) {
          console.log(data);
          console.log('error status : ', data.status);
          $location.path('/disconnected');
          console.log('error... :(');
        });
    };

  }]);
