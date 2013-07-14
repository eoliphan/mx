function FileUploadCtrl($scope, $http) {
  //if (!isOnGitHub) {
  $scope.loadingFiles = true;
  $scope.options = {
    url: url
  };
  $http.get(url)
    .then(
    function (response) {
      $scope.loadingFiles = false;
      $scope.queue = response.data.files;
    },
    function () {
      $scope.loadingFiles = false;
    }
  );
  //}
}