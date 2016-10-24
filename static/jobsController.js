// Make a controller, has $scope and the Jobs service as dependencies
angular.module('renotate').controller('JobsController', ['$scope', 'Jobs', function($scope, Jobs) {
  // attatch the result of Jobs.get() to the scope of this controller
  $scope.jobs = Jobs.get()
}])
