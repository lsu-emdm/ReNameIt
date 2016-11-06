angular.module("renotate").controller("JobController", ["$scope", "$location", "Jobs", ($scope, $location, Jobs) => {
  $scope.jobno = $location.path().split()[$location.path().split().length - 1]
  $scope.jobdata = Job.get({jobno: jobno})
}])
