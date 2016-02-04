'use strict';
/**
 * Created by Garance on 04/01/2016.
 * This service is used for every communication regarding a mix's comments.
 */
angular.module('programmableWebApp')
  .factory('Comment', ['CONSTANTS', '$http', '$cookies', function (CONSTANTS, $http, $cookies) {
    return {

      /**
       * newC: to post a new comment on the server
       * @param mixId the mixId the comment is linked to
       * @param comment the content of the comment
       * @param successCB the success function
       * @param failCB the error function
       */
      newC: function (mixId, comment, successCB, failCB) {
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.com + '/?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: {
            "authorName": $cookies.get('userName'),
            "mixId": mixId,
            "text": comment
          }
        }).then(function (data) {
          successCB(data);
        }, function (error) {
          console.log(error.data);
          failCB(error);
        });
      },
      /**
       * loadMix: to load all the parameters of a given mix
       * @param mixId the mixId to load
       * @param successCB the success function
       * @param failCB the error function
       */
      loadMix: function (mixId, successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.mix + '/?token=' + $cookies.get('token') + '&mixID=' + mixId,
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data);
        }, function (error) {
          console.log(error.data);
          failCB(error);
        });
      }
    };
  }]);
