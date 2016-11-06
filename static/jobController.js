angular.module('renotate').controller("JobController", ["$scope", "$location", "Job", ($scope, $location, Job) => {
  $scope.jobid = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
  $scope.jobdata = Job.get({jobid: $scope.jobid})
}])
