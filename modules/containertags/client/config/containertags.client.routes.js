'use strict';

// Setting up route
angular.module('containertags').config(['$stateProvider',
  function ($stateProvider) {
    // Containertags state routing
    $stateProvider
      .state('containertags', {
        abstract: true,
        url: '/containertags',
        template: '<ui-view/>'
      })
      .state('containertags.list', {
        url: '',
        templateUrl: 'modules/containertags/client/views/list-containertags.client.view.html'
      })
      .state('containertags.create', {
        url: '/create',
        templateUrl: 'modules/containertags/client/views/create-containertag.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('containertags.view', {
        url: '/:containertagId',
        templateUrl: 'modules/containertags/client/views/view-containertag.client.view.html'
      })
      .state('containertags.editWithTag', {
        url: '/:containertagId/editwithtag',
        templateUrl: 'modules/containertags/client/views/editwithtag-containertag.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('containertags.edit', {
        url: '/:containertagId/edit',
        templateUrl: 'modules/containertags/client/views/edit-containertag.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
