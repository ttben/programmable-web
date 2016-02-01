'use strict';
/**
 * Created by Garance on 04/01/2016.
 */
angular.module('programmableWebApp') 
  .factory('Comment', ['CONSTANTS', '$http', '$cookies', function(CONSTANTS, $http, $cookies) {
    var obj = {
      newC: function(mixId, comment, successCB, failCB) {
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.com+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: { "authorName": $cookies.get('userName'),
            "mixId": mixId,
            "text": comment
          }
        }).then(function (data) {
          successCB(data);
        }, function(error) {
          console.log(error.data);
          failCB(error);
        });
      },
      //          Music.loadMix(theMix.id, function(tracks) {
      loadMix: function(mixId, successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.mix+'/?token='+$cookies.get('token')+'&mixID='+mixId,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data);
        }, function(error) {
          console.log(error.data);
          failCB(error);
        });
      }
    };
    return obj;
  }]);
