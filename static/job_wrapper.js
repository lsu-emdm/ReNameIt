// TODO: organize to remove wrappers
var app = angular.module('renotate', ['ngResource'])

// Add a custom html tag called jobs-list (inferred from camelcase javascript)
app.directive('job', () => {
  return {
    templateUrl: '/job.html'
  }
})
