'use strict';

/**
 * Created by Garance on 11/01/2016.
 * This service is related to every communication about users
 */
angular.module('programmableWebApp')
  .factory('User', ['$http', 'CONSTANTS', '$cookies', function ($http, CONSTANTS, $cookies) {
    return {
      /**
       * authenticate: to authenticate an existing user
       * @param userEmail the userEmail or username
       * @param userPassword the user password
       * @param successCB the success function
       * @param failCB the fail function
       */
      authenticate: function (userEmail, userPassword, successCB, failCB) {
        $cookies.remove('token');
        $cookies.remove('userName');
        var jsonObject = {"email": userEmail, "password": userPassword};
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + 'authenticate',
          data: jsonObject
        }).then(function (data) {
          if (data.status === 200) {
            console.log($cookies);
            $cookies.put('token', data.data.token);
            $cookies.put('userName', userEmail);
            console.log($cookies);
            successCB(data.data);
          }
          else {
            failCB(data);
          }
        }, function (data) {
          failCB(data);
        });
      },
      /**
       * signup: create a new user with a specific role
       * @param userEmail the user email or name
       * @param userPassword the user password
       * @param userRole the user role
       * @param successCB the success function
       * @param failCB the fail function
       */
      signUp: function (userEmail, userPassword, userRole, successCB, failCB) {
        var newUser = {"email": userEmail, "password": userPassword, "role": userRole};
        $cookies.remove('token');
        $cookies.remove('userName');
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + 'signup',
          data: newUser,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          console.log(data);
          if (data.status === 201) {
            successCB(data.data);
            $cookies.put('token', data.data.token);
            $cookies.put('userName', userEmail);
          }
          else {
            failCB(data);
          }
        }, function (data) {
          failCB(data);
        });
      }
    };

  }]);
