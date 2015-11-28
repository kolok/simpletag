'use strict';

// Containertags controller
angular.module('containertags').controller('ContainertagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Containertags',
  function ($scope, $stateParams, $location, Authentication, Containertags) {
    $scope.authentication = Authentication;

    // Create new Containertag
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'containertagForm');

        return false;
      }

      // Create new Containertag object
      var containertag = new Containertags({
        title: this.title,
        comment: this.comment
      });

      // Redirect after save
      containertag.$save(function (response) {
        $location.path('containertags/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.comment = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Containertag
    $scope.remove = function (containertag) {
      if (containertag) {
        containertag.$remove();

        for (var i in $scope.containertags) {
          if ($scope.containertags[i] === containertag) {
            $scope.containertags.splice(i, 1);
          }
        }
      } else {
        $scope.containertag.$remove(function () {
          $location.path('containertags');
        });
      }
    };

    // Update existing Containertag
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'containertagForm');

        return false;
      }

      var containertag = $scope.containertag;

      containertag.$update(function () {
        $location.path('containertags/' + containertag._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Containertags
    $scope.find = function () {
      $scope.containertags = Containertags.query();
    };

    // Find existing Containertag
    $scope.findOne = function () {
      $scope.containertag = Containertags.get({
        containertagId: $stateParams.containertagId
      });
    };

    // Find existing Containertag with its Container Tags
    $scope.findOneWithTags = function () {
      $scope.containertag = Containertags.getWithTags({
        containertagId: $stateParams.containertagId
      });
    };

  }
]);
