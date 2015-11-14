'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Containertag = mongoose.model('Containertag'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a containertag
 */
exports.create = function (req, res) {
  var containertag = new Containertag(req.body);
  containertag.user = req.user;

  containertag.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(containertag);
    }
  });
};

/**
 * Show the current containertag
 */
exports.read = function (req, res) {
  res.json(req.containertag);
};

/**
 * Update a containertag
 */
exports.update = function (req, res) {
  var containertag = req.containertag;

  containertag.title = req.body.title;
  containertag.comment = req.body.comment;

  containertag.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(containertag);
    }
  });
};

/**
 * Delete an containertag
 */
exports.delete = function (req, res) {
  var containertag = req.containertag;

  containertag.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(containertag);
    }
  });
};

/**
 * List of Containertags
 */
exports.list = function (req, res) {
  Containertag.find().sort('-created').populate('user', 'displayName').exec(function (err, containertags) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(containertags);
    }
  });
};

/**
 * Containertag middleware
 */
exports.containertagByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Containertag is invalid'
    });
  }

  Containertag.findById(id).populate('user', 'displayName').exec(function (err, containertag) {
    if (err) {
      return next(err);
    } else if (!containertag) {
      return res.status(404).send({
        message: 'No containertag with that identifier has been found'
      });
    }
    req.containertag = containertag;
    next();
  });
};
