/**
 * Created by Garance on 04/01/2016.
 */
angular.module('programmableWebApp')
  .factory('Music', ["CONSTANTS", '$http', function(CONSTANTS, $http) {
    var obj = {
      add: function(recipe, successCB, failCB) {
        $http.post(CONSTANTS.backendUrl + CONSTANTS.recipesPath, recipe)
          .success(function (result) {
            successCB(result);
          })
          .error(failCB);
      },
      all: function(successCB, failCB) {
        $http.get(CONSTANTS.backendUrl + CONSTANTS.music)
          .success(function (result) {
            console.log('got the musics : ', result);
            successCB(result);
          })
          .error(failCB);
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
