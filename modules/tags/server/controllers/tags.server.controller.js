'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tag = mongoose.model('Tag'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a tag
 */
exports.create = function (req, res) {
  var tag = new Tag(req.body);
  tag.user = req.user;

  tag.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tag);
    }
  });
};

/**
 * Show the current tag
 */
exports.read = function (req, res) {
  res.json(req.tag);
};

/**
 * Update a tag
 */
exports.update = function (req, res) {
  var tag = req.tag;

  tag.title = req.body.title;
  tag.content = req.body.content;

  tag.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tag);
    }
  });
};

/**
 * Delete an tag
 */
exports.delete = function (req, res) {
  var tag = req.tag;

  tag.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tag);
    }
  });
};

/**
 * List of Tags
 */
exports.list = function (req, res) {
  Tag.find().sort('-created').populate('user', 'displayName').exec(function (err, tags) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tags);
    }
  });
};

/**
 * Tag middleware
 */
exports.tagByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tag is invalid'
    });
  }

  Tag.findById(id).populate('user', 'displayName').exec(function (err, tag) {
    if (err) {
      return next(err);
    } else if (!tag) {
      return res.status(404).send({
        message: 'No tag with that identifier has been found'
      });
    }
    req.tag = tag;
    next();
  });
};
