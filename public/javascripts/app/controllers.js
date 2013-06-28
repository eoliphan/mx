function SignUpDlgCtrl($scope, dialog, $http) {
  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };


}

function MainCtrl($http, $scope, $route, $routeParams, $location, $rootScope, $dialog, principal, authority, authService) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.user = principal;

  $scope.email = '';
  $scope.password = '';
  $scope.loginMsg = '';
  var authUrl = "/api/auth";

  // check for current auth on reload
  $http
    .get(authUrl)
    .success(function (data) {
      // we have a good session
      authService.loginConfirmed();
      authority.authorize(data);

      $scope.email = '';
      $scope.password = '';
      $scope.curUser = data;

    });

  $scope.loginButtonClick = function () {
    var body = {
      email: $scope.email,
      password: $scope.password
    };
    $http
      .post(authUrl, body)
      .success(function (data) {
        authService.loginConfirmed();
        authority.authorize(data);

        $scope.email = '';
        $scope.password = '';
        $scope.curUser = data;

      })
      .error(function (data) {
        $scope.loginMsg = 'Invalid Credentials';
        $rootScope.$broadcast('event:signin-failed');

      })


  }

  $scope.logout = function () {
    $http
      ['delete'](authUrl)
      .success(function () {
        authority.deauthorize();
      });

  }

  // setup signup dialog
  $rootScope.signupopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/signupdlg',
    controller: 'SignUpDlgCtrl'
  }
  $rootScope.openSignUpDialog = function () {
    var d = $dialog.dialog($rootScope.signupopts);
    d.open().then(function (userInfo) {
      console.log(userInfo);
      if (userInfo) {
        $http
          .post('/api/signup', userInfo)
          .success(function (data) {

          })
          .error(function (data) {

          });
      }
    })
  }

}

function HomeCtrl($scope, $http) {
  $scope.offers = [];
  $scope.gridOptions = {
    data: 'offers',
    columnDefs: [
      {field: "name", displayName: "Album/Song"},
      {field: "amtToRaise", displayName: "Raise Amount"},
      {field: "numShares", displayName: "# Shares"},
      {field: "pctOfferingToSell", displayName: "% For Sale"},
      {cellTemplate: "<div><a ng-click='editAlbum(row)' class='btn btn-small btn-primary' style='margin-left: float; margin-right: float'>More Info</a></div>"}
    ]
  };
  $http.get('/api/offers')
    .success(function (data) {
      console.log(data);
      $scope.offers = data;
      //$scope.gridOptions.data = $scope.albums;

      if (!$scope.$$phase) {
        $scope.$apply();
      }

    })

}
function StoreCtrl($scope) {
  $scope.carInterval = 5000;
  $scope.slides = [
    {image: 'images/store/store1.jpg', title: 'Moop', text: 'Their Debut Release'},
    {image: 'images/store/store2.jpg', title: 'Vanguard', text: 'Their Sophmore Album'},
    {image: 'images/store/store1.jpg', title: 'Orion 2', text: 'Topping the Charts'}
  ];


}
function CartCtrl() {

}
function AboutCtrl() {

}
function FaqCtrl() {

}

function ProfileCtrl() {

}


function BuySharesDlgCtrl($scope, dialog, $http) {

  // get the offer info

  var offerUrl = "/api/offers/info/" + dialog.options.offerId;
  $http
    .get(offerUrl)
    .success(function (data) {
      $scope.offer = data;
      $scope.offer.sharePrice = (data.amtToRaise / data.numShares).toFixed(2);
      $scope.offer.shareBuysYou = (data.pctOfferingToSell / 100) * (100 / data.numShares);
    });

  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };
}
function BuyChipsDlgCtrl($scope, dialog) {

  //todo add read of current chip data
  $scope.close = function (chipWager) {
    dialog.close(chipWager);
  };
}
/**
 * Controller for album page
 *
 * @todo this controller contains cut-and-pasted Jqery that needs refactoring
 * @param $http
 * @param $scope
 * @param $stateParams
 * @param $state
 * @constructor
 */
function AlbumCtrl($http, $scope, $stateParams, $state, $dialog, socket) {


  var albumId = $stateParams.albumId;

  $http
    .get('/api/album/' + albumId)
    .success(function (data) {
      $scope.albumInfo = data;
      // format price and releasedate


    })
  //todo: bind to model
  $scope.rate = 3;
  $scope.buychipsopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/buychipsdlg', // OR: templateUrl: 'path/to/view.html',
    controller: 'BuyChipsDlgCtrl'
  }
  $scope.openBuyChipsDialog = function () {

    var d = $dialog.dialog($scope.buychipsopts);
    d.open().then(function (chipsPurchased) {
      if (chipsPurchased) {
        console.log(chipsPurchased);
      } else {
        return;
      }
      var command = {
        itemId: albumId,
        itemType: "album",
        chipCount: chipsPurchased,
        name: $scope.albumInfo.albums.name
      };
      $http
        .post('/api/wagers', command)
        .success(function (data) {
          console.log(data);

        })
        .error(function (data) {

        });
    });
  };
  $scope.buysharesopts = {
    backdrop: true,
    keyboard: true,
    backdropClick: true,
    templateUrl: '/partials/buysharesdlg', // OR: templateUrl: 'path/to/view.html',
    controller: 'BuySharesDlgCtrl'
  }

  $scope.openBuySharesDialog = function () {
    var opts = $scope.buysharesopts; //todo: copy?
//        opts.resolve = {
//            offerId: $scope.albumInfo.albums.offerId
//
//        }
    opts.offerId = $scope.albumInfo.albums.offerId;
    var d = $dialog.dialog(opts);
    d.open().then(function (sharesPurchased) {
      if (sharesPurchased) {
        console.log(sharesPurchased);
      } else {
        return;
      }
      var data = {
        sharesPurchased: sharesPurchased
      }
      $http
        .post("/api/offers/investments/" + $scope.albumInfo.albums.offerId, data)
        .success(function (data) {
          console.log(data);

        })
        .error(function (data) {

        });
    });
  };

  //todo: Legacy JQuery for conversion
  //-------------------------------
  $('#sharesPurchased').kendoNumericTextBox({min: 0});
  $('#chipsPurchased').kendoNumericTextBox({min: 0});
  socket.on('investmentAddedToOffer', function (data) {
    /*setTimeout(function(){
     checkCart();
     },250);*/
    alert("Shares purchased");
    $('#buySharesModal').modal('hide');

  });
  socket.on('chipWagerCreated', function (data) {
    alert("Wager placed on album");
  });

  $('#addToCart').click(function () {
    //var formData = $('#investorInfoForm').serialize();
    //var id = $("#uid").val();
    var newUuid = uuid.v4();
    var command = {
      id: newUuid,
      command: "addItemToOrder",
      payload: {
        itemType: "album",
        itemId: "XXalbumId",
        name: "XXalbumName",
        price: 0, //XXalbumPrice
        artistId: "XXartistId",
        isActiveOffer: true, // is active offer
        offerId: "XXofferId"

      }
    };
    socket.emit("command", command);
    /*$.ajax({
     type:"POST",
     url:"/cart/item",
     data: {itemType:"album",itemId: "#{locals.info.albums._id}"},
     success: function(data) {
     //alert(sent);
     $('#alert').show();
     }
     });*/

  });
  $('#buyNow').click(function () {
    //var formData = $('#investorInfoForm').serialize();
    //var id = $("#uid").val();
    $.ajax({
      type: "POST",
      url: "/buynow/item",
      data: {itemType: "album", itemId: "XXXalbumId"},
      success: function (data) {
        //alert(sent);
        $('#alert').show();
      }
    });

  });

}
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
function EditAlbumCtrl($http, $scope, $stateParams, $state, $dialog, socket) {
  var albumId = $stateParams.albumId;

  $scope.editing = {
    isDirty: false
  }


  $scope.selectTrack = function (trackId) {
    console.log('track id: ' + trackId);
    var curTrack = _.find($scope.albumInfo.albums.songs, function (song) {
      return trackId === song.itemId
    });
    $scope.curTrack = curTrack;
  }

  $scope.uploadTrack = function (trackId) {
    console.log("uloading: " + trackId);
  }

  $scope.curTrack = {};
  function refreshAlbum() {
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

            });

        }

      })
  }

  refreshAlbum();
  socket.on('albumUpdated', function () {
    console.log("refresh");
    setTimeout(function () {
      refreshAlbum();
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
    }
    socket.emit("command", cmd);
    $scope.editing.isDirty = false;

  }
  $scope.addTrack = function () {
    console.log("addTrack");
    var song = {
      name: "New Track...",
      itemId: uuid.v4()
    }
    var cmd = {
      command: 'addSongToAlbum',
      id: uuid.v4(),
      payload: {
        albumId: $scope.albumInfo.albums._id,
        song: song
      }
    }
    //todo: this is experimental, socket.io v http
    socket.emit('command', cmd);
    $scope.albumInfo.albums.songs.push(song);
  }
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
    }
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