'use strict';

// Configuring the Tags module
angular.module('tags').run(['Menus',
  function (Menus) {
    // Add the tags dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Tags',
      state: 'tags',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tags', {
      title: 'List Tags',
      state: 'tags.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tags', {
      title: 'Create Tags',
      state: 'tags.create',
      roles: ['user']
    });
  }
]);
