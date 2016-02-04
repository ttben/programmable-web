'use strict';

/**
 * @ngdoc overview
 * @name programmableWebApp
 * @description
 * # programmableWebApp
 *
 * Main module of the application.
 */
angular
  .module('programmableWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'audioPlayer-directive',
    'waveform-directive',
    'time-indicator-directive',
    'ui.bootstrap',
    'star-directive'
  ])
  /**
   * The router configuration
   */
  .config(function ($routeProvider) {
    $routeProvider
      .when('/musicPlayer', {
        templateUrl: 'views/musicPlayer.html',
        controller: 'MusicPlayerCtrl',
        controllerAs: 'musicPlayer'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/disconnected', {
        templateUrl: 'views/disconnected.html',
        controller: 'DisconnectedCtrl',
        controllerAs: 'disconnected'
      })
      .otherwise({
        redirectTo: '/disconnected'
      });
  })
  /**
   * This function is run at the beginning of the app, to check if the user's token is still valid.
   * We do a dummy request without carying for the result.
   */
  .run(['$rootScope', '$location', '$cookies', '$http', 'CONSTANTS', function($rootScope, $location, $cookies, $http, CONSTANTS) {
    //we set the header to home before knowing more.
    $rootScope.header = "home";
    $http({
      method: 'GET',
      url:  CONSTANTS.backendUrl + 'songs?token='+$cookies.get('token'),
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
    }).then(function () {
      $rootScope.header = "default";
      $location.path('/home');

    }, function(error) {
      $cookies.remove('token');
      console.log(error.data);
      $rootScope.header = "home";
      $location.path('/disconnected');
    });

  }]);
