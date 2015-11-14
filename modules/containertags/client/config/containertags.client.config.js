'use strict';

// Configuring the Containertags module
angular.module('containertags').run(['Menus',
  function (Menus) {
    // Add the tags dropdown item
    Menus.addMenuItem('topbar', {
      title: 'ContainerTags',
      state: 'containertags',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'containertags', {
      title: 'List Containtags',
      state: 'containertags.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'containertags', {
      title: 'Create Containertags',
      state: 'containertags.create',
      roles: ['user']
    });
  }
]);
