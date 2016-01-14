'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('LoginCtrl', ['$scope', '$cookies', 'User', '$location', function ($scope, $cookies, User, $location) {

      if (typeof($cookies.get('token')) !== 'undefined') {
        $location.path('/home');
      }


    $scope.user = {"email": "", "pwd": ""};

    $scope.SignIn = function () {
      User.authenticate($scope.user.email, $scope.user.pwd, function (token) {
          //console.log('token is : ', token);
          $location.path('/home');
        },
        function (error) {
          console.log('error... :(');
        })
    };

  }]);
