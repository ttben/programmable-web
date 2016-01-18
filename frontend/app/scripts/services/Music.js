'use strict';
/**
 * Created by Garance on 04/01/2016.
 */
angular.module('programmableWebApp')
  .factory('Music', ['CONSTANTS', '$http', '$cookies', function(CONSTANTS, $http, $cookies) {
    var obj = {
      add: function(recipe, successCB, failCB) {
        $http.post(CONSTANTS.backendUrl + CONSTANTS.recipesPath, recipe)
          .success(function (result) {
            successCB(result);
          })
          .error(failCB);
      },
      all: function(successCB, failCB) {
        console.log('cookies token '+$cookies.get('token'));
        var token = $cookies.get('token');
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music+'?token='+token,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
            successCB(data.data.data);
          }, function(error) {
            console.log(error);
            failCB()
          });
      },
      get: function(musicName, successCB, failCB) {
        $http.get(CONSTANTS.backendUrl + CONSTANTS.music)
          .success(function (result) {
            console.log('got the music named ', musicName, ' : ', result);
            successCB(result);
          })
          .error(failCB);
      }
    };
    return obj;
  }]);
