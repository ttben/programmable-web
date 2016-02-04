'use strict';
/**
 * Created by Garance on 04/01/2016.
 * This service is used for every communication related to a song and its mixes.
 * You can also rate a mix.
 */
angular.module('programmableWebApp')
  .factory('Music', ['CONSTANTS', '$http', '$cookies', function (CONSTANTS, $http, $cookies) {
    return {
      /**
       * all : get all the songs in the database
       * @param successCB the success function
       * @param failCB the fail function
       */
      all: function (successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music + '?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data.data.data);
        }, function (error) {
          console.log(error);
          failCB(error);
        });
      },
      /**
       * get: get a specific song with its id
       * @param musicId the id of the song we want
       * @param successCB the success function
       * @param failCB the fail function
       */
      get: function (musicId, successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.music + '/' + musicId + '/?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data.data);
        }, function (error) {
          console.log(error);

          failCB(error);
        });
      },
      /**
       * createMix: create a new mix associated with a song
       * @param musicId the music id the mix must be linked to
       * @param mixName the name given to the mix
       * @param tracks the tracks configuration for the mix
       * @param successCB the success function
       * @param failCB the fail function
       */
      createMix: function (musicId, mixName, tracks, successCB, failCB) {
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.mix + '/?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: {
            "authorId": $cookies.get('token'),
            "author": $cookies.get('userName'),
            "musicId": musicId,
            "mixName": mixName,
            "tracks": tracks
          }
        }).then(function (data) {
          successCB(data);
        }, function (error) {
          console.log(error.data);
          failCB(error);
        });
      },
      /**
       * loadMix: load a specific mix's configuration with its id
       * @param mixId the mix id to load
       * @param successCB the success function
       * @param failCB the fail function
       */
      loadMix: function (mixId, successCB, failCB) {
        $http({
          method: 'GET',
          url: CONSTANTS.backendUrl + CONSTANTS.mix + '/' + mixId + '/?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function (data) {
          successCB(data);
        }, function (error) {
          console.log(error.data);
          failCB(error);
        });
      },
      /**
       * rate: rate a mix with your user id. If the user already voted, it changes its vote.
       * @param mixId the mix id concerned
       * @param myRating the rating the used gives
       * @param successCB the success function
       * @param failCB the fail function
       */
      rate: function (mixId, myRating, successCB, failCB) {
        console.log(mixId);
        $http({
          method: 'POST',
          url: CONSTANTS.backendUrl + CONSTANTS.mix + '/' + CONSTANTS.rating + '/?token=' + $cookies.get('token'),
          headers: {'Content-Type': 'application/json; charset=UTF-8'},
          data: {
            "mixId": mixId,
            "rating": myRating
          }
        }).then(function (data) {
          console.log(data.data);
          successCB(data.data.rating);
        }, function (error) {
          console.log(error.data);
          failCB(error);
        });
      }
    };
  }]);
