'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('SignUpCtrl',['$scope', 'User', '$location', function ($scope, User, $location) {
    $scope.user={"email":"", "pwd":""};
    $scope.SignUp = function() {
      User.signUp($scope.user.email, $scope.user.pwd, function() {
          $location.path('/musics');
        },
        function() {
          console.log('error... :(');
        })
    };


  }]);
