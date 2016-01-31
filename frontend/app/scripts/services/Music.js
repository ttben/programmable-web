'use strict';
/**
 * Created by Garance on 04/01/2016.
 */
angular.module('programmableWebApp')
  .factory('Music', ['CONSTANTS', '$http', '$cookies', function(CONSTANTS, $http, $cookies) {
    return {
      all: function(successCB, failCB) {
        var token = $cookies.get('token');
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music+'?token='+token,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
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
            successCB(data.data);
          }, function(error) {
          console.log(error);

          failCB(error);
        });
      },
      createMix: function(musicId, mixName, tracks, successCB, failCB) {
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.mix+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: { "authorId": $cookies.get('token'),
            "author": $cookies.get('userName'),
            "musicId": musicId,
            "mixName": mixName,
            "tracks": tracks
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
          url: CONSTANTS.backendUrl + CONSTANTS.mix+'/'+mixId+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data);
        }, function(error) {
          console.log(error.data);
          failCB(error);
        });
      },
      rate:function (mixId, myRating, successCB, failCB) {
     /*   $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.mix+'/'+mixId+'/?token='+$cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: {myRating: myRating}
        }).then(function (data) {
          successCB(data);
        }, function(error) {
          console.log(error.data);
          failCB(error);
        });*/
        successCB(myRating);
    }

    };
  }]);
