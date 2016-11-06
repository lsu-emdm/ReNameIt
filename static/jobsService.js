// Make a new service called Jobs. It's dependent on $resource
// Newer versions of angular rename service as factor
angular.module('renotate').factory('Jobs', ['$resource', ($resource) => {
  return $resource('/alljobs', null, {
    get : {method:'GET', isArray: true}
  })
}])
