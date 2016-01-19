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
            failCB();
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
          failCB();
        });
      }
    };
    return obj;
  }]);
