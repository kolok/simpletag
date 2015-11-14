'use strict';

//Containertags service used for communicating with the containertags REST endpoints
angular.module('containertags').factory('Containertags', ['$resource',
  function ($resource) {
    return $resource('api/containertags/:containertagId', {
      containertagId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
