angular.module('renotate').controller("JobController", ["$scope", "Job", ($scope, Job) => {
  $scope.jobid = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
  $scope.jobdata = Job.get({jobid: $scope.jobid})
  $scope.loaded = false
  // promises...
  $scope.jobdata.$promise.then((result) => {
    // once the job data has been received, make tone players out of them
    $scope.orig = new Tone.Player(window.location.origin+"/"+result.file, () => {
      // then once tone is done, retransform the nexus widgets because of how angular works

      nx.transform(document.getElementById("originalWaveform"))
      //nexus has defined this now
      originalWaveform.setBuffer($scope.orig.buffer._buffer)
    }).toMaster()
    window.orig = $scope.orig
    $scope.foreground = new Tone.Player(window.location.origin+"/"+"foregrounds/"+result.name+"_"+result.multer_id, () => {
      nx.transform(document.getElementById("foregroundWaveform"))
      foregroundWaveform.setBuffer($scope.foreground.buffer._buffer)
    }).toMaster()
    $scope.background = new Tone.Player(window.location.origin+"/"+"backgrounds/"+result.name+"_"+result.multer_id, () => {
      nx.transform(document.getElementById("backgroundWaveform"))
      backgroundWaveform.setBuffer($scope.background.buffer._buffer)
    }).toMaster()
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
