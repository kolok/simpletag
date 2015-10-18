'use strict';

(function () {
  // Tags Controller Spec
  describe('Tags Controller Tests', function () {
    // Initialize global variables
    var TagsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Tags,
      mockTag;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Tags_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Tags = _Tags_;

      // create mock tag
      mockTag = new Tags({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Tag about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Tags controller.
      TagsController = $controller('TagsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one tag object fetched from XHR', inject(function (Tags) {
      // Create a sample tags array that includes the new tag
      var sampleTags = [mockTag];

      // Set GET response
      $httpBackend.expectGET('api/tags').respond(sampleTags);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.tags).toEqualData(sampleTags);
    }));

    it('$scope.findOne() should create an array with one tag object fetched from XHR using a tagId URL parameter', inject(function (Tags) {
      // Set the URL parameter
      $stateParams.tagId = mockTag._id;

      // Set GET response
      $httpBackend.expectGET(/api\/tags\/([0-9a-fA-F]{24})$/).respond(mockTag);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.tag).toEqualData(mockTag);
    }));

    describe('$scope.create()', function () {
      var sampleTagPostData;

      beforeEach(function () {
        // Create a sample tag object
        sampleTagPostData = new Tags({
          title: 'An Tag about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Tag about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Tags) {
        // Set POST response
        $httpBackend.expectPOST('api/tags', sampleTagPostData).respond(mockTag);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the tag was created
        expect($location.path.calls.mostRecent().args[0]).toBe('tags/' + mockTag._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/tags', sampleTagPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock tag in scope
        scope.tag = mockTag;
      });

      it('should update a valid tag', inject(function (Tags) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/tags\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/tags/' + mockTag._id);
      }));

      it('should set scope.error to error response message', inject(function (Tags) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/tags\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(tag)', function () {
      beforeEach(function () {
        // Create new tags array and include the tag
        scope.tags = [mockTag, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/tags\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockTag);
      });

      it('should send a DELETE request with a valid tagId and remove the tag from the scope', inject(function (Tags) {
        expect(scope.tags.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.tag = mockTag;

        $httpBackend.expectDELETE(/api\/tags\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to tags', function () {
        expect($location.path).toHaveBeenCalledWith('tags');
      });
    });
  });
}());
