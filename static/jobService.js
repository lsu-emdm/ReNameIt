angular.module('renotate').factory('Job', ['$resource', ($resource) => {
  // defaults are good enough
  return $resource('/jobd/:jobid')
}])
