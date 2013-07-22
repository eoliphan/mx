/* jshint */
/* global io */
/* global angular */


angular.module('soundscry.services', []).
  value('version', '0.1').
  factory('socket', function ($rootScope) {
    'use strict';
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }).
  factory('lookups',function($http,$rootScope){
    'use strict';

    function refreshLookups() {
      $rootScope.lookups = {};
      $http.
        get('/api/states').
        success(function(data){
          $rootScope.lookups.states = data;

        });
    }
    refreshLookups();
    return {
      refresh: function() {

      }
    };

  });

