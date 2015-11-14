'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Containertag = mongoose.model('Containertag'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, containertag;

/**
 * Containertag routes tests
 */
describe('Containertag CRUD tests', function () {
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

    // Save a user to the test db and create new containertag
    user.save(function () {
      containertag = {
        title: 'Containertag Title',
        comment: 'Containertag Comment'
      };

      done();
    });
  });

  it('should be able to save an containertag if logged in', function (done) {
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

        // Save a new containertag
        agent.post('/api/containertags')
          .send(containertag)
          .expect(200)
          .end(function (containertagSaveErr, containertagSaveRes) {
            // Handle containertag save error
            if (containertagSaveErr) {
              return done(containertagSaveErr);
            }

            // Get a list of containertags
            agent.get('/api/containertags')
              .end(function (containertagsGetErr, containertagsGetRes) {
                // Handle containertag save error
                if (containertagsGetErr) {
                  return done(containertagsGetErr);
                }

                // Get containertags list
                var containertags = containertagsGetRes.body;

                // Set assertions
                (containertags[0].user._id).should.equal(userId);
                (containertags[0].title).should.match('Containertag Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an containertag if not logged in', function (done) {
    agent.post('/api/containertags')
      .send(containertag)
      .expect(403)
      .end(function (containertagSaveErr, containertagSaveRes) {
        // Call the assertion callback
        done(containertagSaveErr);
      });
  });

  it('should not be able to save an containertag if no title is provided', function (done) {
    // Invalidate title field
    containertag.title = '';

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

        // Save a new containertag
        agent.post('/api/containertags')
          .send(containertag)
          .expect(400)
          .end(function (containertagSaveErr, containertagSaveRes) {
            // Set message assertion
            (containertagSaveRes.body.message).should.match('Title cannot be blank');

            // Handle containertag save error
            done(containertagSaveErr);
          });
      });
  });

  it('should be able to update an containertag if signed in', function (done) {
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

        // Save a new containertag
        agent.post('/api/containertags')
          .send(containertag)
          .expect(200)
          .end(function (containertagSaveErr, containertagSaveRes) {
            // Handle containertag save error
            if (containertagSaveErr) {
              return done(containertagSaveErr);
            }

            // Update containertag title
            containertag.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing containertag
            agent.put('/api/containertags/' + containertagSaveRes.body._id)
              .send(containertag)
              .expect(200)
              .end(function (containertagUpdateErr, containertagUpdateRes) {
                // Handle containertag update error
                if (containertagUpdateErr) {
                  return done(containertagUpdateErr);
                }

                // Set assertions
                (containertagUpdateRes.body._id).should.equal(containertagSaveRes.body._id);
                (containertagUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of containertags if not signed in', function (done) {
    // Create new containertag model instance
    var containertagObj = new Containertag(containertag);

    // Save the containertag
    containertagObj.save(function () {
      // Request containertags
      request(app).get('/api/containertags')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single containertag if not signed in', function (done) {
    // Create new containertag model instance
    var containertagObj = new Containertag(containertag);

    // Save the containertag
    containertagObj.save(function () {
      request(app).get('/api/containertags/' + containertagObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', containertag.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single containertag with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/containertags/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Containertag is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single containertag which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent containertag
    request(app).get('/api/containertags/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No containertag with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an containertag if signed in', function (done) {
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

        // Save a new containertag
        agent.post('/api/containertags')
          .send(containertag)
          .expect(200)
          .end(function (containertagSaveErr, containertagSaveRes) {
            // Handle containertag save error
            if (containertagSaveErr) {
              return done(containertagSaveErr);
            }

            // Delete an existing containertag
            agent.delete('/api/containertags/' + containertagSaveRes.body._id)
              .send(containertag)
              .expect(200)
              .end(function (containertagDeleteErr, containertagDeleteRes) {
                // Handle containertag error error
                if (containertagDeleteErr) {
                  return done(containertagDeleteErr);
                }

                // Set assertions
                (containertagDeleteRes.body._id).should.equal(containertagSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an containertag if not signed in', function (done) {
    // Set containertag user
    containertag.user = user;

    // Create new containertag model instance
    var containertagObj = new Containertag(containertag);

    // Save the containertag
    containertagObj.save(function () {
      // Try deleting containertag
      request(app).delete('/api/containertags/' + containertagObj._id)
        .expect(403)
        .end(function (containertagDeleteErr, containertagDeleteRes) {
          // Set message assertion
          (containertagDeleteRes.body.message).should.match('User is not authorized');

          // Handle containertag error error
          done(containertagDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Containertag.remove().exec(done);
    });
  });
});
