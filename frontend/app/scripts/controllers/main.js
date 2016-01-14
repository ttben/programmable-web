'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('MainCtrl',['$scope', '$cookies', 'User', '$location', function ($scope, $cookies, User, $location) {
    $scope.user={"email":"", "pwd":""};
    $scope.SignIn = function() {
      User.authenticate($scope.user.email, $scope.user.pwd, function(token) {
        //console.log('token is : ', token);
        $location.path('/musics');
      },
      function(error) {
        console.log('error... :(');
      })
    };
    $scope.connectedUser = true;

  }]);
