'use strict';

// Setting up route
angular.module('tags').config(['$stateProvider',
  function ($stateProvider) {
    // tags state routing
    $stateProvider
      .state('tags', {
        abstract: true,
        url: '/tags',
        template: '<ui-view/>'
      })
      .state('tags.list', {
        url: '',
        templateUrl: 'modules/tags/client/views/list-tags.client.view.html'
      })
      .state('tags.create', {
        url: '/create',
        templateUrl: 'modules/tags/client/views/create-tag.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('tags.view', {
        url: '/:tagId',
        templateUrl: 'modules/tags/client/views/view-tag.client.view.html'
      })
      .state('tags.edit', {
        url: '/:tagId/edit',
        templateUrl: 'modules/tags/client/views/edit-tag.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
