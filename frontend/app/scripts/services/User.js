/**
 * Created by Garance on 11/01/2016.
 */
angular.module('programmableWebApp')
  .factory('User', ["CONSTANTS", '$http', function(CONSTANTS, $http) {
    var obj = {
      authenticate: function(userEmail, userPassword, successCB, failCB) {
        var jsonObject = {"email": userEmail, "password": userPassword};
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + 'authenticate',
          data: jsonObject,
          headers: {'Content-Type': 'application/json'}
        }).then(function (data) {
            successCB(data);
          }
          , function (data) {
            failCB(data)
          })
      ;
        /*$http.post(CONSTANTS.backendUrl + "authenticate", jsonObject)
          .success(function (result) {
            console.log('authentication success !');
            console.log(result);
            successCB(result);
          })
          .error(failCB);*/
      },
      signUp: function(userEmail, userPassword, successCB, failCB) {
        var jsonObject = {"email":userEmail, "password":userPassword};
        $http.post(CONSTANTS.backendUrl + "signup", jsonObject)
          .success(function (result) {
            console.log('sign in success');
            console.log(result);
            successCB(result);
          })
          .error(failCB);
      }
    };
    return obj;
  }]);
