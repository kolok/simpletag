'use strict';

/**
 * Module dependencies.
 */
var tagsPolicy = require('../policies/tags.server.policy'),
  tags = require('../controllers/tags.server.controller');

module.exports = function (app) {
  // Tags collection routes
  app.route('/api/tags').all(tagsPolicy.isAllowed)
    .get(tags.list)
    .post(tags.create);

  // Single tag routes
  app.route('/api/tags/:tagId').all(tagsPolicy.isAllowed)
    .get(tags.read)
    .put(tags.update)
    .delete(tags.delete);

  // Finish by binding the tag middleware
  app.param('tagId', tags.tagByID);
};
