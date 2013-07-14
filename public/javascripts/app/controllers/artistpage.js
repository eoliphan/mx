function ArtistPageCtrl($http, $scope, $stateParams) {
  var artistId = $stateParams.artistId;

  function refreshArtist() {
    $http
      .get('/api/artist/' + artistId)
      .success(function (data) {
        $scope.artist = data;
        // format price and releasedate

      })
  }

  refreshArtist();

  $scope.random = Math.random;

}