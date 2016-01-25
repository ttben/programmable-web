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
  .run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
    $http({
      method: 'GET',
      url: 'http://localhost:3001/songs?token='+$cookies.get('token'),
      headers: {'Content-Type': 'application/json; charset=UTF-8'}
    }).then(function (data) {
      console.log('connected');
      $rootScope.header = "default";
      $location.path('/home');

    }, function(error) {
      console.log(error.data);
      $rootScope.header = "home";
      $location.path('/disconnected');

    });

  }]);
