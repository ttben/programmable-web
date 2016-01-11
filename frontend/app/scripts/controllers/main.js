'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('MainCtrl',['$scope', '$rootScope', 'User', function ($scope, $rootScope, User) {
    $scope.user={"email":"", "pwd":""};
    $scope.SignIn = function() {
      User.authenticate($scope.user.email, $scope.user.pwd, function(token) {
        console.log('token is : ', token);
        $rootScope.token = token;
      },
      function(error) {
        console.log('error... :(');
      })
    }


  }]);
