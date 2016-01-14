/**
 * Created by Garance on 11/01/2016.
 */
angular.module('programmableWebApp')
  .factory('User', ['$http', 'CONSTANTS', '$cookies', function($http, CONSTANTS, $cookies) {
    var obj = {
      authenticate: function (userEmail, userPassword, successCB, failCB) {
        $cookies.remove('token');
        $cookies.remove('userName');
        var jsonObject = {"email":userEmail, "password":userPassword};
        $http({
          method: 'POST',
          url: 'http://localhost:3001/authenticate',
          data: jsonObject
        }).then(function (data) {
            if (data.status == 200) {
              console.log($cookies);
              $cookies.put('token', data.data.token);
              $cookies.put('userName', userEmail);
              console.log($cookies);
              successCB(data.data);
            }
          else {
              failCB(data);
            }
        }
          , function (data) {
            failCB(data)
          });
      },
      signUp: function (userEmail, userPassword, successCB, failCB) {
        var newUser = {"email": userEmail, "password": userPassword, "role": "admin"};
        $cookies.remove('token');
        $cookies.remove('userName');
        $http({
          method: 'POST',
          url: 'http://localhost:3001/signup',
          data: newUser,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          console.log(data);
          if (data.status == 201) {
            successCB(data.data);
            $cookies.put('token', data.data.token);
            $cookies.put('userName', userEmail);
          }
          else {
            failCB(data);
          }
          }
          , function (data) {
            failCB(data)
          });
      }
  };
    return obj;

  }]);
