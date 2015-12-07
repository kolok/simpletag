'use strict';

// Tags controller
angular.module('tags').controller('TagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tags', 'Containertags', '$filter',
  function ($scope, $stateParams, $location, Authentication, Tags, Containertags, $filter) {
    $scope.authentication = Authentication;

    // get container tag list
    $scope.containertags = Containertags.query();

    // Create new Tag
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'tagForm');

        return false;
      }
      // Create new Tag object
      var tag = new Tags({
        title: this.title,
        content: this.content,
        containertag: this.containertag
      });

      // Redirect after save
      tag.$save(function (response) {
        $location.path('tags/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.containertagId = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Tag
    $scope.remove = function (tag) {
      if (tag) {
        tag.$remove();

        for (var i in $scope.tags) {
          if ($scope.tags[i] === tag) {
            $scope.tags.splice(i, 1);
          }
        }
      } else {
        $scope.tag.$remove(function () {
          $location.path('tags');
        });
      }
    };

    // Update existing Tag
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'tagForm');

        return false;
      }

      var tag = $scope.tag;
			tag.containertag = tag.containertag._id;

      tag.$update(function () {
        $location.path('tags/' + tag._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    var appendContainertag = function appendContainertag(t) {
			// You could substitue use of filter here with underscore etc.
      console.log(t.containertag);
			t.containertag = $filter('filter')($scope.containertags, {_id: t.containertag})[0];
      console.log(t.containertag);
		};

    // Find a list of Tags
    $scope.find = function () {
      $scope.tags = Tags.query();
    };

    // Find existing Tag
    $scope.findOne = function () {
      $scope.tag = Tags.get({
        tagId: $stateParams.tagId
      },appendContainertag);
    };
  }
]);
