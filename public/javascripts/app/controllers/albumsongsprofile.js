










function AlbumSongsProfileCtrl($http, $scope, $location, socket) {
  $scope.myData = [
    {name: "Moroni", age: 50},
    {name: "Tiancum", age: 43},
    {name: "Jacob", age: 27},
    {name: "Nephi", age: 29},
    {name: "Enos", age: 34}
  ];
  $scope.addAlbum = function () {
    var payload = {
      id: $scope.curUser._id,
      albumId: (new ObjectId()).toString(),
      name: "New Album...",
      description: "Add A Description...",
      price: 0

    }
    cmd = {
      id: uuid.v4(),
      command: "addAlbum",
      payload: payload

    }
    socket.emit("command", cmd);

  }
  socket.on('albumAdded', function (data) {
    console.log("album added: " + JSON.stringify(data));
    //todo: need positive ack
    setTimeout(function () {
      $location.path('/album/edit/' + data.albumId);
    }, 1000);

  });
  $scope.editAlbum = function (row) {
    console.log("edit album");
    console.log(row.entity.albums._id);
    $location.path('/album/edit/' + row.entity.albums._id);
  }
  $scope.albums = [];
  $scope.gridOptions = {
    data: 'albums',
    columnDefs: [
      {field: "albums.name", displayName: "Album/Song"},
      {field: "albums.price", displayName: "Price"},
      {field: "albums.isActiveOffer", displayName: "Active Offer"},
      {cellTemplate: "<div><a ng-click='editAlbum(row)' class='btn btn-small btn-primary'>Edit</a></div>"}
    ]
  };
  $http.get('/api/albums/byuser/' + $scope.curUser._id)
    .success(function (data) {
      console.log(data);
      $scope.albums = data;
      //$scope.gridOptions.data = $scope.albums;

      if (!$scope.$$phase) {
        $scope.$apply();
      }

    })

}