'use strict';

/**
 * @ngdoc function
 * @name programmableWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the programmableWebApp
 */
angular.module('programmableWebApp')
  .controller('SignUpCtrl',['$scope', '$rootScope', 'User', function ($scope, $rootScope, User) {
    $scope.user={"email":"", "pwd":""};
    $scope.SignUp = function() {
      User.signUp($scope.user.email, $scope.user.pwd, function(token) {
          console.log('token is : ', token);
          $rootScope.token = token;
        },
        function(error) {
          console.log('error... :(');
        })
    }


  }]);
