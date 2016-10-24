// Make a new service called Jobs. It's dependent on $resource
// Newer versions of angular rename service as factor
angular.module('renotate').factory('Jobs', ['$resource', function($resource) {
  return $resource('/jobs', null, {
    get : {method:'GET', isArray: true}
  })
}])
