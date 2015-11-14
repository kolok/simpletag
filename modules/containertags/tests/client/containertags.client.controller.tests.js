'use strict';

(function () {
  // Containertags Controller Spec
  describe('Containertags Controller Tests', function () {
    // Initialize global variables
    var ContainertagsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Containertags,
      mockContainertag;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Containertags_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Containertags = _Containertags_;

      // create mock containertag
      mockContainertag = new Containertags({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Containertag about MEAN',
        comment: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Containertags controller.
      ContainertagsController = $controller('ContainertagsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one containertag object fetched from XHR', inject(function (Containertags) {
      // Create a sample containertags array that includes the new containertag
      var sampleContainertags = [mockContainertag];

      // Set GET response
      $httpBackend.expectGET('api/containertags').respond(sampleContainertags);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.containertags).toEqualData(sampleContainertags);
    }));

    it('$scope.findOne() should create an array with one containertag object fetched from XHR using a containertagId URL parameter', inject(function (Containertags) {
      // Set the URL parameter
      $stateParams.containertagId = mockContainertag._id;

      // Set GET response
      $httpBackend.expectGET(/api\/containertags\/([0-9a-fA-F]{24})$/).respond(mockContainertag);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.containertag).toEqualData(mockContainertag);
    }));

    describe('$scope.create()', function () {
      var sampleContainertagPostData;

      beforeEach(function () {
        // Create a sample containertag object
        sampleContainertagPostData = new Containertags({
          title: 'An Containertag about MEAN',
          comment: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Containertag about MEAN';
        scope.comment = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Containertags) {
        // Set POST response
        $httpBackend.expectPOST('api/containertags', sampleContainertagPostData).respond(mockContainertag);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.comment).toEqual('');

        // Test URL redirection after the containertag was created
        expect($location.path.calls.mostRecent().args[0]).toBe('containertags/' + mockContainertag._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/containertags', sampleContainertagPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock containertag in scope
        scope.containertag = mockContainertag;
      });

      it('should update a valid containertag', inject(function (Containertags) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/containertags\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/containertags/' + mockContainertag._id);
      }));

      it('should set scope.error to error response message', inject(function (Containertags) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/containertags\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(containertag)', function () {
      beforeEach(function () {
        // Create new containertags array and include the containertag
        scope.containertags = [mockContainertag, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/containertags\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockContainertag);
      });

      it('should send a DELETE request with a valid containertagId and remove the containertag from the scope', inject(function (Containertags) {
        expect(scope.containertags.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.containertag = mockContainertag;

        $httpBackend.expectDELETE(/api\/containertags\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to containertags', function () {
        expect($location.path).toHaveBeenCalledWith('containertags');
      });
    });
  });
}());
