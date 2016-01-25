'use strict';
/**
 * Created by Garance on 04/01/2016.
 */
angular.module('programmableWebApp')
  .factory('Music', ['CONSTANTS', '$http', '$cookies', function(CONSTANTS, $http, $cookies) {
    var obj = {
      all: function(successCB, failCB) {
        console.log('cookies token '+$cookies.get('token'));
        var token = $cookies.get('token');
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music+'?token='+token,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          console.log(data);
            successCB(data.data.data);
          }, function(error) {
            console.log(error);
            failCB(error);
          });
      },
      get: function(musicName, successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music+'/'+musicName+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
            console.log('got the music named ', musicName, ' : ', data);
            successCB(data.data);
          }, function(error) {
          console.log(error);

          failCB(error);
        });
      },
      createMix: function(userId, userName, musicId, mixName, tracks, successCB, failCB) {
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.mix+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: { "authorId": userId,
            "author": userName,
            "musicId": musicId,
            "mixName": mixName,
            "tracks": tracks
          }
        }).then(function (data) {
          console.log('bloup bloup');
          successCB(data);
        }, function(error) {
          console.log(error.data);
          failCB(error);
        });
      }
    };
    return obj;
  }]);
