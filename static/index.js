// Make the renotate module. Needs angular-resource as a dependency
var app = angular.module('renotate', ['ngResource'])

// Add a custom html tag called jobs-list (inferred from camelcase javascript)
app.directive('jobsList', () => {
  return {
    templateUrl: 'jobs-list.html'
  }
})
