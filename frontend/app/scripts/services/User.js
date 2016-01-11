/**
 * Created by Garance on 11/01/2016.
 */
angular.module('programmableWebApp')
  .factory('User', ['$http', "CONSTANTS", function($http, CONSTANTS) {
    var obj = {
      authenticate: function (userEmail, userPassword, successCB, failCB) {
        var jsonObject = {"email":userEmail, "password":userPassword};
        $http({
          method: 'POST',
          url: 'http://localhost:3001/authenticate',
          data: jsonObject
        }).then(function (data) {
            if (data.status == 200) {
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
        $http({
          method: 'POST',
          url: 'http://localhost:3001/signup',
          data: newUser,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          console.log(data);
          if (data.status == 200) {
            successCB(data.data);
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
    /*var obj = {
      getJSON: function(jsonAddress, successCB, data) {
        successCB(data);
      },
      authenticate: function(recipe, successCB, failCB) {
        $http.post(CONSTANTS.backendUrl + CONSTANTS.auth, recipe)
          .success(function (result) {
            successCB(result);
          })
          .error(failCB);
      }
    };
    return obj;*/
  }]);
