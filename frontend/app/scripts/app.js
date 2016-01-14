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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
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
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

