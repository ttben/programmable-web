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
    'ui.bootstrap'
  ])

  .config(function ($routeProvider) {

    $routeProvider
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
      .when('/disconnected', {
        templateUrl: 'views/disconnected.html',
        controller: 'DisconnectedCtrl',
        controllerAs: 'disconnected'
      })
      .otherwise({
        redirectTo: '/disconnected'
      });
  })
  .run(['$rootScope', '$location', '$cookies', function($rootScope, $location, $cookies) {
   // console.log('the token : ' + $cookies.get('token'));
    if ($cookies.get('token') == 'undefined') {
      console.log('not connected');
      $rootScope.header = "home";
    }
    else {
     // console.log('connected');
      $rootScope.header = "default";
    }
  }]);
