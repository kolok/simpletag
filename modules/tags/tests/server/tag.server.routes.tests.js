'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tag = mongoose.model('Tag'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tag;

/**
 * Tag routes tests
 */
describe('Tag CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new tag
    user.save(function () {
      tag = {
        title: 'Tag Title',
        content: 'Tag Content'
      };

      done();
    });
  });

  it('should be able to save an tag if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tag
        agent.post('/api/tags')
          .send(tag)
          .expect(200)
          .end(function (tagSaveErr, tagSaveRes) {
            // Handle tag save error
            if (tagSaveErr) {
              return done(tagSaveErr);
            }

            // Get a list of tags
            agent.get('/api/tags')
              .end(function (tagsGetErr, tagsGetRes) {
                // Handle tag save error
                if (tagsGetErr) {
                  return done(tagsGetErr);
                }

                // Get tags list
                var tags = tagsGetRes.body;

                // Set assertions
                (tags[0].user._id).should.equal(userId);
                (tags[0].title).should.match('Tag Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an tag if not logged in', function (done) {
    agent.post('/api/tags')
      .send(tag)
      .expect(403)
      .end(function (tagSaveErr, tagSaveRes) {
        // Call the assertion callback
        done(tagSaveErr);
      });
  });

  it('should not be able to save an tag if no title is provided', function (done) {
    // Invalidate title field
    tag.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tag
        agent.post('/api/tags')
          .send(tag)
          .expect(400)
          .end(function (tagSaveErr, tagSaveRes) {
            // Set message assertion
            (tagSaveRes.body.message).should.match('Title cannot be blank');

            // Handle tag save error
            done(tagSaveErr);
          });
      });
  });

  it('should be able to update an tag if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tag
        agent.post('/api/tags')
          .send(tag)
          .expect(200)
          .end(function (tagSaveErr, tagSaveRes) {
            // Handle tag save error
            if (tagSaveErr) {
              return done(tagSaveErr);
            }

            // Update tag title
            tag.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing tag
            agent.put('/api/tags/' + tagSaveRes.body._id)
              .send(tag)
              .expect(200)
              .end(function (tagUpdateErr, tagUpdateRes) {
                // Handle tag update error
                if (tagUpdateErr) {
                  return done(tagUpdateErr);
                }

                // Set assertions
                (tagUpdateRes.body._id).should.equal(tagSaveRes.body._id);
                (tagUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of tags if not signed in', function (done) {
    // Create new tag model instance
    var tagObj = new Tag(tag);

    // Save the tag
    tagObj.save(function () {
      // Request tags
      request(app).get('/api/tags')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single tag if not signed in', function (done) {
    // Create new tag model instance
    var tagObj = new Tag(tag);

    // Save the tag
    tagObj.save(function () {
      request(app).get('/api/tags/' + tagObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', tag.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single tag with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tags/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tag is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single tag which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent tag
    request(app).get('/api/tags/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No tag with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an tag if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new tag
        agent.post('/api/tags')
          .send(tag)
          .expect(200)
          .end(function (tagSaveErr, tagSaveRes) {
            // Handle tag save error
            if (tagSaveErr) {
              return done(tagSaveErr);
            }

            // Delete an existing tag
            agent.delete('/api/tags/' + tagSaveRes.body._id)
              .send(tag)
              .expect(200)
              .end(function (tagDeleteErr, tagDeleteRes) {
                // Handle tag error error
                if (tagDeleteErr) {
                  return done(tagDeleteErr);
                }

                // Set assertions
                (tagDeleteRes.body._id).should.equal(tagSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an tag if not signed in', function (done) {
    // Set tag user
    tag.user = user;

    // Create new tag model instance
    var tagObj = new Tag(tag);

    // Save the tag
    tagObj.save(function () {
      // Try deleting tag
      request(app).delete('/api/tags/' + tagObj._id)
        .expect(403)
        .end(function (tagDeleteErr, tagDeleteRes) {
          // Set message assertion
          (tagDeleteRes.body.message).should.match('User is not authorized');

          // Handle tag error error
          done(tagDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tag.remove().exec(done);
    });
  });
});
