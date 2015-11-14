'use strict';

/**
 * Module dependencies.
 */
var containertagsPolicy = require('../policies/containertags.server.policy'),
  containertags = require('../controllers/containertags.server.controller');

module.exports = function (app) {
  // Containertags collection routes
  app.route('/api/containertags').all(containertagsPolicy.isAllowed)
    .get(containertags.list)
    .post(containertags.create);

  // Single containertag routes
  app.route('/api/containertags/:containertagId').all(containertagsPolicy.isAllowed)
    .get(containertags.read)
    .put(containertags.update)
    .delete(containertags.delete);

  // Finish by binding the containertag middleware
  app.param('containertagId', containertags.containertagByID);
};
