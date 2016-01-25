/**
 * Created by Garance on 04/01/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name FrontendApp.service:CONSTANTS
 * @description
 * # BCONSTANTS
 * Service of the FrontendApp
 */
angular.module('programmableWebApp')
  .constant('CONSTANTS', {
    backendUrl: 'http://localhost:3001/',
    music:'songs',
    auth:'authenticate',
    mix:'mixes',
    com:'comments'
  });
