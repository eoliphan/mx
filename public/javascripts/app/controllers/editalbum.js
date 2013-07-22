/* jshint browser:true, devel:true */
/* global _:true */
/* global uuid:true */

function EditAlbumCtrl($http, $scope, $stateParams, $state, $dialog, socket) {
  "use strict";

  var albumId = $stateParams.albumId;

  $scope.graph = {
    spark1:{}
  };
  $scope.offerBreakdownOptions = {
    type: "pie",

    data: [20, 30, 30],
    chartArea: {
      width: 100,
      height: 100
    }

  };
  $scope.editing = {
    isDirty: false
  };


  $scope.selectTrack = function (trackId) {
    console.log('track id: ' + trackId);
    var curTrack = _.find($scope.albumInfo.albums.songs, function (song) {
      return trackId === song.itemId;
    });
    $scope.curTrack = curTrack;
  };

  $scope.uploadTrack = function (trackId) {
    console.log("uloading: " + trackId);
  };

  $scope.curTrack = {};
  $scope.refreshAlbum = function() {
    $http
      .get('/api/album/' + albumId)
      .success(function (data) {
        $scope.albumInfo = data;

        //do we have any offer info?
        if ($scope.albumInfo.albums.isActiveOffer) {
          $http
            .get('/api/offers/info/' + $scope.albumInfo.albums.offerId)
            .success(function (data) {
              $scope.offerInfo = data;
              $scope.offerBreakdownOptions.data = [15, $scope.offerInfo.pctOfferingToSell, ($scope.offerInfo.pctOfferingToSell - 100)];
              console.log(_.functions($scope.graph.spark1));
              $scope.graph.spark1.refresh();

            });

        }

      });
  };

  $scope.refreshAlbum();
  socket.on('albumUpdated', function () {
    console.log("refresh");
    setTimeout(function () {
      $scope.refreshAlbum();
    }, 2000);

  });
  $scope.saveChanges = function () {

    console.log("saveChanges");
    var album = _.clone($scope.albumInfo.albums);
    album.itemId = $scope.albumInfo.albums._id;
    var cmd = {
      id: uuid.v4(),
      command: "updateAlbum",

      payload: album
    };
    socket.emit("command", cmd);
    $scope.editing.isDirty = false;

  };
  $scope.addTrack = function () {
    console.log("addTrack");
    var song = {
      name: "New Track...",
      itemId: uuid.v4()
    };
    var cmd = {
      command: 'addSongToAlbum',
      id: uuid.v4(),
      payload: {
        albumId: $scope.albumInfo.albums._id,
        song: song
      }
    };
    //todo: this is experimental, socket.io v http
    socket.emit('command', cmd);
    $scope.albumInfo.albums.songs.push(song);
  };
  // handle model changes
//    $scope.$watch('albumInfo.albums.name', function (newVal, oldVal) {
//        console.log("Old Val: " + oldVal + " : newVal " + newVal);
//
//    });

  //---- todo: legacy code for refactoring
  function prepEditorPayload(params) {
    var retParam = {};
    retParam[params.name] = params.value;
    retParam.itemId = "#{locals.info.albums._id}";
    retParam.id = "#{locals.info._id}";
    return retParam;
  }


  $scope.$on('fileuploadadd', function (e, data) {
    console.log('image uploading' + data);
    //console.log("song: " + $scope.song)
    data.formData = {
      //albumId: $scope.albumInfo.albums._id,
      itemId: $scope.albumInfo.albums._id
      //origFileName: data.files[0].name
    };
    // set the file name locally
    //$scope.song.origFileName = data.files[0].name;
    data.submit();
  });
//  $scope.progstyle = {};
//  $scope.$on('fileuploadprogress', function (e, data) {
//
//    var progress = parseInt(data.loaded / data.total * 100, 10);
//    $scope.progstyle = {
//      width: progress + "%"
//
//    };
//    console.log("file upload progress: " + data);
//    //
//  });
  //-- todo: angular-fileupload stuff seems a little sketchy right now.  will stick to this for time being.

//  $('#imgupload').fileupload({
//    url: "/uploads",
//    dataType: 'json',
//    done: function (e, data) {
////            $.each(data.result.files, function (index, file) {
////                $('<p/>').text(file.name).appendTo(document.body);
////            });
//    }
//
//
//  });
//
//  $scope.files = [];
//  $('#fileupload').fileupload({
//    url: "/fileuploads",
//    dataType: 'json',
//    done: function (e, data) {
//      $.each(data.result.files, function (index, file) {
//        $('<p/>').text(file.name).appendTo('#files');
//      });
//    },
//    progressall: function (e, data) {
//      var progress = parseInt(data.loaded / data.total * 100, 10);
//      $('#progress .bar').css(
//        'width',
//        progress + '%'
//      );
//    },
//    progress: function (e, data) {
//      var progress = parseInt(data.loaded / data.total * 100, 10);
//      $('#progress .bar').css(
//        'width',
//        progress + '%'
//      );
//
//    },
//    add: function (e, data) {
//      //data.context = $('<p/>').text('Uploading...'+data.files[0].name).appendTo("#files");
//
//      $scope.$apply(function () {
//        $scope.files.push(data.files[0].name);
//      });
//      //data.files[0].itemId=uuid.v4();
//      data.formData = {
//        itemId: uuid.v4(),
//        albumId: $scope.albumInfo.albums._id
//      }
//      data.submit();
//    }
//  });


}