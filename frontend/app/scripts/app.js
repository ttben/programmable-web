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
    'time-indicator-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/musicPlayer', {
        templateUrl: 'views/musicPlayer.html',
        controller: 'MusicPlayerCtrl',
        controllerAs: 'musicPlayer'
      })
      .when('/newUser', {
        templateUrl: 'views/newUser.html',
        controller: 'SignUpCtrl',
        controllerAs: 'signUp'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

