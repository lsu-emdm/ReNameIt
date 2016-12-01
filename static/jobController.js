angular.module('renotate').controller("JobController", ["$scope", "Job", ($scope, Job) => {
  $scope.jobid = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
  $scope.jobdata = Job.get({jobid: $scope.jobid})
  $scope.loaded = false
  // promises...
  $scope.jobdata.$promise.then((result) => {
    $scope.orig = new Tone.Player(window.location.origin+"/"+result.file, () => {
      nx.add("waveform")
      waveform1.setBuffer($scope.orig.buffer._buffer)
    }).toMaster()
    window.orig = $scope.orig
    $scope.foreground = new Tone.Player(window.location.origin+"/"+"foregrounds/"+result.name+"_"+result.multer_id).toMaster()
    $scope.background = new Tone.Player(window.location.origin+"/"+"backgrounds/"+result.name+"_"+result.multer_id).toMaster()
  })
  $scope.play = () => {
    $scope.orig.start()
  }
  $scope.playForeground = () => {
    $scope.foreground.start()
  }
  $scope.playBackground = () => {
    $scope.foreground.start()
  }
}])
