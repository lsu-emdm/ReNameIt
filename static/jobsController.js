// Make a controller, has $scope and the Jobs service as dependencies
angular.module('renotate').controller('JobsController', ['$scope', 'Jobs', ($scope, Jobs) => {
  // attatch the result of Jobs.get() to the scope of this controller
  $scope.jobs = Jobs.get()
  $scope.play = (name) => {
    var resourceUrl = "./"+name+'/'+name
    console.log('Playing '+resourceUrl)
    var player = new Tone.Player(resourceUrl).toMaster
    player.autostart = true
  }
}])
