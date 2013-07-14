function TrackCtrl($scope) {
  //listen for fileupload events
  $scope.$on('fileuploadadd', function (e, data) {
    console.log('file added for upl' + data);
    console.log("song: " + $scope.song)
    data.formData = {
      albumId: $scope.albumInfo.albums._id,
      itemId: $scope.song.itemId,
      origFileName: data.files[0].name
    }
    // set the file name locally
    $scope.song.origFileName = data.files[0].name;
    data.submit();
  });
  $scope.progstyle = {};
  $scope.$on('fileuploadprogress', function (e, data) {

    var progress = parseInt(data.loaded / data.total * 100, 10);
    $scope.progstyle = {
      width: progress + "%"

    };
    console.log("file upload progress: " + data);
//
  });

  // post changes
  $scope.$watch('song', function (oldVal, newVal) {
    console.log("Old Val: " + oldVal + " : newVal: " + newVal);
    if (oldVal === newVal) {
      return;
    }
    $scope.editing.isDirty = true;
  }, true);

}